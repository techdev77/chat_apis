const fs = require('fs');
const path = require('path');
const moment = require('moment');

class Logger {
    static separator = `\n------------------------------------------------------------------------------------------------------------------------------------------------\n`;
    
    static logType = '';
    static className = '';
    static methodName = '';
    static data='';
    static lineNo = '';
    static tag = 'UNNAMED_TAG';
    static message = '';
    static exception = null;
    static extra = [];

    static print(logsPath) {
        const logsArray = {
            tag: this.tag,
            message: this.message,
            type: this.logType,
            data:this.data,
            timeStamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            ...this.authToken && { authToken: this.authToken },
            ...this.exception && { exception: this.exception.message },
            ...this.lineNo && { lineNo: this.lineNo },
            ...this.methodName && { methodName: this.methodName.split('::').pop() },
            ...this.className && { className: this.className },
            ...this.extra.length && { extra: this.extra }
        };

        const logStr = JSON.stringify(logsArray, null, 4) + this.separator;

        fs.appendFileSync(logsPath, logStr);
        this.reset();
    }

    static reset() {
        this.logType = 'MESSAGE'; // Replace with actual log types as needed
        this.className = '';
        this.methodName = '';
        this.lineNo = '';
        this.tag = 'UNNAMED_TAG';
        this.message = '';
        this.exception = null;
        this.extra = [];
    }
}


module.exports=Logger;


