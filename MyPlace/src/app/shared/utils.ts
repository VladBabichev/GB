import notify from 'devextreme/ui/notify';

export function dataURIToBlob(dataURI): Blob {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = encodeURI(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

export function errorMessage(msg: string): void {
	notify({
		message: normalizeMessage(msg),
		type: "error",
		displayTime: 30000,
		position: { my: 'top center', at: 'top center' },
		closeOnClick: true
	});
}

export function warningMessage(msg: string): void {
	notify({
		message: normalizeMessage(msg),
		type: "warning",
		displayTime: 30000,
		position: { my: 'center center', at: 'center center' },
		closeOnClick: true
	});
}
export function successMessage(msg: string): void {
    notify({
        message: normalizeMessage(msg),
        type: "success",
        displayTime: 30000,
        position: { my: 'center center', at: 'center center' },
        closeOnClick: true
    });
}
function normalizeMessage(msg: string): string {
    let result: string = msg;
    if (msg != null) {
        let i: number = msg.indexOf("@|");

        if (i > -1)
            result = msg.substring(i + 2);
    }
	return result;
}


/**
	 * Generates a GUID string.
	 * @returns {String} The generated GUID.
	 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
	 * @author Slavik Meltser (slavik@meltser.info).
	 * @link http://slavik.meltser.info/?p=142
	 */
export function guid():string {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8(false) + _p8(true) + _p8(true) + _p8(false);
}

export function checkEmail(email:string):boolean {
    let result: boolean=false;   
    let regex = /[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    if (regex.test(email))
        result = true;
    return result;
}