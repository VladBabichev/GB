import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { HttpErrorResponse } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { Observable, of, empty } from "rxjs";
import {
    map,
    tap,
    filter,
    switchMap,
    mergeMap,
    withLatestFrom,
    catchError
} from 'rxjs/operators';
import * as FileSaver from "file-saver";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { formatMessage } from 'devextreme/localization';

import { AppState } from "../../state";
import { PopupService } from "../../shared/popup/popup.service";
import { ChartState } from "./chart.state";
import * as forRoot from "./chart.actions";
import { ChartService } from "./chart.service";
import * as Constants from "../../shared/errorMessages";

import { CustomTemplateCreateDialogComponent } from "../custom-template-editor/create/custom-template-create-dialog.component";
import * as Utils from "../../shared/utils";

@Injectable()
export class ChartEffects {

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private chartService: ChartService,
        private modalService: NgbModal,
        private popupService: PopupService) {
    }

    //@Effect()
    //onChangeParameters = this.actions$
    //    .ofType(forRoot.SET_PROJECTS)
    //    .withLatestFrom(this.store.select(s => s.chart), (_, state) => state)
    //    .switchMap(state =>
    //        this.chartService
    //            .saveParameters(state.cycleFilter, state.aggregationSettings, state.uomSettings
    //            , state.chart == null ? false : state.legendVisible, state.plotParameters)
    //    ).map(() => new forRoot.StartRefresh());     

    @Effect()
    onChangeParameters = this.actions$.pipe(
        ofType(forRoot.SET_PROJECTS),
        tap(state => this.store.next({ type: forRoot.SET_DEFAULT_PARAMS })),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        //switchMap(state => of<forRoot.ChartAction>(new forRoot.StartRefresh())
        switchMap(_ => { return empty(); })
    );

    @Effect()
    onChangeChartSettings = this.actions$.pipe(
        ofType(forRoot.TOGGLE_LEGEND, forRoot.SET_AXIS_RANGE_SETTINGS, forRoot.SET_CYCLE_FILTER,
            forRoot.SET_AGGREGATION_SETTINGS, forRoot.SET_CHART_SETTINGS, forRoot.SET_UOM_SETTINGS, forRoot.SET_PLOTS_SETTINGS),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(state =>
            this.chartService.saveParameters(state.cycleFilter, state.aggregationSettings, state.uomSettings, state.chart == null ? false : state.legendVisible, state.plotParameters)
                .pipe(
                    map(() => new forRoot.StartDataPointRefresh()),
                    catchError(() => of<forRoot.ChartAction>(new forRoot.EndRefresh(state.chart)))
                )
        )
    );

    @Effect()
    onRefresh = this.actions$.pipe(
        ofType(forRoot.SET_PLOT_TYPE, forRoot.START_REFRESH),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(state =>
            this.chartService.get(state.projects, state.plotType, state.plotTemplateId, state.viewId, state.stateOfCharge)
                .pipe(
                    tap(chart => {
                        if (chart != null && chart != undefined && chart.forcedEveryNthCycle != null && chart.forcedEveryNthCycle != undefined && chart.forcedEveryNthCycle > 0) {
                            Utils.warningMessage("To improve performance we have filtered every " + chart.forcedEveryNthCycle + "th cycle.");
                        }
                        if (chart && (chart.series == null || chart.series.length == 0)) {
                            Utils.errorMessage("No data to plot the chart.");
                        }
                    }),
                    map(chart => new forRoot.EndRefresh(chart)),
                    catchError(error => {
                        Utils.errorMessage(error.message);
                        //return of<forRoot.ChartAction>(new forRoot.RefreshFailed(error), new forRoot.EndRefresh(null));
                        return of<forRoot.ChartAction>(new forRoot.EndRefresh(null));
                    })
                )
        )
    );

    @Effect()
    onSetUserSharedView = this.actions$.pipe(
        ofType(forRoot.SET_SHARED_USER_VIEW),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(state =>
            this.chartService.getSharedView(state.sharedToken)
                .pipe(
                    map(chart => new forRoot.SelectViewCompleated(chart)),
                    catchError(error => {
                        return of<forRoot.ChartAction>(new forRoot.RefreshFailed(error), new forRoot.EndRefresh(null));
                    })
                )
        )
    );

    @Effect()
    onDataPointsRefresh = this.actions$.pipe(
        ofType(forRoot.START_DATAPOINTS_REFRESH),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(state =>
            this.chartService.get(state.projects, state.plotType, state.plotTemplateId, state.viewId, state.stateOfCharge)
                .pipe(
                    map(chart => new forRoot.EndDataPointRefresh(chart)),
                    catchError(error => {
                        return of<forRoot.ChartAction>(new forRoot.RefreshFailed(this.getFailedMessage(error)), new forRoot.EndRefresh(null));
                    })
                )
        )
    );

    @Effect()
    onExport = this.actions$.pipe(
        ofType(forRoot.START_EXPORT),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(state =>
            this.chartService
                .export(state.projects, state.plotType, state.cycleFilter, state.aggregationSettings, state.uomSettings, state.chart == null ? 1 : state.chart.pointSize
                    , state.chart == null ? null : state.chart.selectedTemplateName, state.stateOfCharge, state.chartImageBlob)
                .pipe(
                    tap(blob => FileSaver.saveAs(blob, "Export.xlsx")),
                    map(() => new forRoot.EndExport()),
                    catchError(error => {
                        Utils.errorMessage(error.message);
                        return of<forRoot.ChartAction>(new forRoot.EndExport());
                    })
                )
        )
    );

    @Effect()
    onExportAll = this.actions$.pipe(
        ofType(forRoot.START_EXPORT_ALL),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(state =>
            this.chartService
                .exportAll(state.projects, state.plotType, state.uomSettings, state.chart == null ? 1 : state.chart.pointSize
                    , state.chart == null ? null : state.chart.selectedTemplateName, state.stateOfCharge, state.chartImageBlob)
                .pipe(
                    tap(blob => FileSaver.saveAs(blob, "Export.xlsx")),
                    map(() => new forRoot.EndExport()),
                    catchError(error => {
                        Utils.errorMessage(error.message);
                        return of<forRoot.ChartAction>(new forRoot.EndExport());
                    })
                )
        )
    );

    @Effect()
    onSaveTemplate = this.actions$.pipe(
        ofType(forRoot.SAVE_PLOT_TEMPLATE),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(state =>
            this.chartService
                .savetemplate(state.projects, state.plotTemplate)
                .pipe(
                    switchMap(plotsData =>
                        [
                            new forRoot.StartRefreshPlotTemplates(),
                            new forRoot.SelectPlotsTemplate(plotsData.selectedTemplate)
                        ]),
                    catchError(error => {
                        return of<forRoot.ChartAction>(new forRoot.RefreshFailed(error), new forRoot.EndPlotTemplatesRefresh(null));
                    }
                    )
                )
        )
    );

    @Effect()
    onSelectView = this.actions$.pipe(
        ofType(forRoot.SELECT_VIEW),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        tap(state => this.store.next({ type: forRoot.SET_DEFAULT_PARAMS })),
        //switchMap(state =>
        //    this.chartService
        //        .getbyview(state.viewId)
        //        .pipe(
        //            map(chart => new forRoot.SelectViewCompleated(chart)),
        //            catchError(error => of<forRoot.ChartAction>(new forRoot.RefreshFailed(this.getFailedMessage(error)), new forRoot.EndRefresh(null)))
        //        )
        //)
        switchMap(_ => {

            return empty();
        })
    );

    @Effect()
    onChangePlots = this.actions$.pipe(
        ofType(forRoot.SELECT_PLOT_TEMPLATE),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        tap(state => this.store.next({ type: forRoot.SET_DEFAULT_PARAMS })),
        switchMap(state =>
            this.chartService
                .getbytemplate(state.projects, state.plotTemplateId)
                .pipe(
                    map(chart => new forRoot.EndRefresh(chart)),
                    catchError(error => {
                        Utils.errorMessage(error.message);
                        return of<forRoot.ChartAction>(new forRoot.EndRefresh(null));
                    })
                )
        )
    );

    @Effect()
    onStateOfCharge = this.actions$.pipe(
        ofType(forRoot.SET_STATE_OF_CHARGE),
        switchMap((action: forRoot.SetStateOfCharge) =>
            this.chartService.setStateOfCharge(action.projects, action.stateOfCharge)
                .pipe(map(chart => new forRoot.EndSetStateOfCharge(chart)))
        )
    );

    @Effect()
    onShareTemplate = this.actions$.pipe(
        ofType(forRoot.SHARE_TEMPLATE),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(state =>
            this.chartService.shareTemplate(state.shareSettings.objectIds, state.shareSettings.email, state.plotType)
            .pipe(
                map(c => {
                    Utils.successMessage(formatMessage("template-shared-successfully", []));
                    return empty();
                }),
                catchError(error => {
                    Utils.errorMessage(error.message);
                    return empty();
                })
            )
        )
    );


    @Effect()
    onShareProject = this.actions$.pipe(
        ofType(forRoot.SHARE_PROJECT),
        switchMap((action: forRoot.ShareProject) =>
            this.chartService.shareProject(action.objectIds, action.email)
                .pipe(
                    map(shp => new forRoot.ShareProject(null, null)),
                    catchError(error => of<forRoot.ShareProject>())
                )
        )
    );

    @Effect()
    onDeleteProjects = this.actions$.pipe(
        ofType(forRoot.DELETE_PROJECTS),
        switchMap((action: forRoot.DeleteProjects) =>
            this.chartService.deleteProjects(action.objectIds)
                .pipe(
                    map(shp => new forRoot.StartRefreshPlotTemplates()),
                    catchError(error => of<forRoot.DeleteProjects>(error))
                )
        )
    );

    @Effect()
    onDeleteTemplate = this.actions$.pipe(
        ofType(forRoot.DELETE_PLOT_TEMPLATE),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(state =>
            this.chartService.deletetemplate(state.projects, state.plotTemplate)
                .pipe(
                    map(plotTemplates => new forRoot.StartRefreshPlotTemplates()),
                    catchError(error => of<forRoot.ChartAction>(new forRoot.RefreshFailed(error), new forRoot.EndPlotTemplatesRefresh(null)))
                )
        )
    );

    @Effect()
    onRefreshPlotTemplates = this.actions$.pipe(
        ofType(forRoot.START_PLOT_TEMPLATE_REFRESH),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(state =>
            this.chartService.getPlots()
                .pipe(
                    map(plotTemplates => new forRoot.EndPlotTemplatesRefresh(plotTemplates)),
                    catchError(error => of<forRoot.ChartAction>(new forRoot.RefreshFailed(error), new forRoot.EndPlotTemplatesRefresh(null)))
                )
        )
    );

    @Effect()
    onSetDefaultParameters = this.actions$.pipe(
        ofType(forRoot.SET_DEFAULT_PARAMS),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(state =>
            this.chartService.setDefaultParameters()
                .pipe(map(() => new forRoot.StartRefresh()))
        )
    );

    @Effect()
    onShowCreateTemplateFromChartDialog = this.actions$.pipe(
        ofType(forRoot.CREATE_TEMPLATE_FROM_CHART_DIALOG_OPEN),
        withLatestFrom(this.store.select(s => s.chart), (_, state) => state),
        switchMap(_ => {
            this.modalService.open(CustomTemplateCreateDialogComponent);
            return empty();
        })
    );

    @Effect()
    onCreateTemplateFromChartConfirmation = this.actions$.pipe(
        ofType(forRoot.CREATE_TEMPLATE_FROM_CHART_CONFIRM_DIALOG_OPEN),
        withLatestFrom(this.store.select(s => s.chart)),
        switchMap(([action, state]) => {
            const templateName = (<forRoot.CreateTemplateFromChartConfirmDialogOpen>action).templateName;
            const template = state.plotTemplates.find(t => t.name == templateName);

            if (template) {
                this.popupService.showConfirm("Confirm Template Overwriting", `Template ${templateName} already exsit. Do you want to overwrite this template?`)
                    .subscribe(result => {
                        if (!result)
                            this.store.dispatch(new forRoot.CreateTemplateFromChartDialogOpen());
                        else {
                            var newTemplate = this.chartService.createTemplate(templateName, state.plotType, state.plotTemplate, state.plotParameters);
                            newTemplate.id = template.id;
                            newTemplate.userId = template.userId;
                            this.store.dispatch(new forRoot.SavePlotsTemplate(newTemplate));
                        }
                    });
            }
            else {
                this.store.dispatch(new forRoot.CreateTemplateFromChart(templateName));
            }

            return empty();
        })
    );

    @Effect()
    onCreateTemplateFromChart = this.actions$.pipe(
        ofType(forRoot.CREATE_TEMPLATE_FROM_CHART),
        withLatestFrom(this.store.select(s => s.chart)),
        switchMap(([action, state]) =>
            this.chartService.savetemplate(
                state.projects,
                this.chartService.createTemplate(
                    (<forRoot.CreateTemplateFromChart>action).templateName,
                    state.plotType,
                    state.plotTemplate,
                    state.plotParameters))
                .pipe(
                    mergeMap(plotsData =>
                        [
                            new forRoot.SelectPlotsTemplate(plotsData.selectedTemplate),
                            new forRoot.StartRefreshPlotTemplates()
                        ]),
                    catchError(error => of<forRoot.ChartAction>(new forRoot.RefreshFailed(error), new forRoot.EndPlotTemplatesRefresh(null)))
                )
        )
    );

    private getFailedMessage(response: HttpErrorResponse): string {
        const body = response.error;
        const status = (body || {}).status;

        return Constants.errorMessages[status] || "";
    }
}
