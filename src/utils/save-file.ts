export class FileSaver {
    private element: HTMLLinkElement;
    private txtToSave: string;

    constructor(id: string) {
        setTimeout(() => {
            this.element = document.getElementById(id) as HTMLLinkElement;
            this.element.setAttribute('download', id);
        });
    }

    setTextToSave(txt: string) {
        this.txtToSave += txt;
        this.element.href = window.URL.createObjectURL(new Blob([this.txtToSave], { type: 'text/txt' }));
    }

    download(filename: string) {
    }
}
