declare class Error {
    public name:string;
    public message:string;
    public stack:string;
    constructor(message?:string);
    static captureStackTrace(error: Error, constructorOpt: any);
}

class HTTPException implements Error {
    public name:string = 'HttpException';
    public message:string;
    public type:string = 'HTTP_EXCEPTION';
    public stack:string;
    public innerException: Error;
    public status:number;

    constructor(status:any, message?: string, innerException?: Error|string) {
        // Guard against throw Exception(...) usage.
        if (!(this instanceof HTTPException)) return new HTTPException(status, message, innerException);

        Error.apply(this, arguments);

        if (typeof Error.captureStackTrace === 'function') {
            //noinspection JSUnresolvedFunction
            Error.captureStackTrace(this, arguments.callee);
        }

        this.message = message;
        this.status = status;

        if (innerException) {
            if (innerException instanceof Error) {
                this.innerException = innerException;
                this.message = this.getMessages() + ", innerException: " + this.innerException.message;
            }
            else if (typeof innerException === "string") {
                this.innerException = new Error(innerException);
                this.message = this.getMessages() + ", innerException: " + this.innerException.message;
            }
            else {
                this.innerException = innerException;
                this.message = this.getMessages() + ", innerException: " + this.innerException;
            }
        }
        else {
            this.message = message;
        }
    }

    /**
     *
     * @returns {number}
     */
    getStatus():number{
        return this.status;
    }

    /**
     *
     * @returns {string}
     */
    getMessages(): string{
        return this.type.replace(/_/gi, ' ')  + (this.message ? ' - ' + this.message : '');
    }
}

export = HTTPException;