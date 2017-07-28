import {ReportsSchema, TableColumn} from "./reports-schema";
import { LocalDataSource } from "ng2-smart-table";
import { Input } from "@angular/core";

export class CsvCreator {

    public source: LocalDataSource;
    columnMap: Map<string, TableColumn> = new Map<string, TableColumn>();
    @Input() settings: any;
    private reportSchema = new ReportsSchema();

    onSearch(query: string = "") {

        this.source.setFilter([
            // fields we want to include in the search
            {
                field: "name",
                search: query
            }
        ], false);


        // second parameter specifying whether to perform "AND" or "OR" search
        // (meaning all columns should contain search query or at least one)
        // "AND" by default, so changing to "OR" by setting false here
    }


    export2Csv(): void {

        const columns: TableColumn[] = Array.from(this.columnMap.values());

        let encodedStr = columns.reduce((acct, current: TableColumn) => {

            if (current.isExport !== false) {
                return acct += "'" + current.title + "',";
            }
            else {
                return acct;
            }
        }, "");
        encodedStr = encodedStr.slice(0, -1);
        encodedStr += "\r\n";

        let fields: string[] = columns.reduce((acct, column: TableColumn) => {

            if (column.isExport !== false) {
                acct.push(column.field);
            }
            return acct;
        }, []);

        this.source.getAll().then((rows) => {

            rows.forEach((row) => {
                fields.forEach((field) => {
                    if (row.hasOwnProperty(field)) {
                        let value = row[field];

                        if (!value) {
                            value = "";
                        }
                        let valuePrepare = this.columnMap.get(field).valuePrepareFunction;
                        if (valuePrepare) {
                            value = valuePrepare.call(null, value, row);
                        }
                        encodedStr += "'" + value + "',";
                    }
                });
                encodedStr = encodedStr.slice(0, -1);
                encodedStr += "\r\n";
            });

            let a = document.createElement("a");
            a.setAttribute("style", "display:none;");
            document.body.appendChild(a);

            // Set utf-8 header to let excel recognize its encoding
            let blob = new Blob(["\ufeff", encodedStr], { type: "text/csv" });
            a.href = window.URL.createObjectURL(blob);
            a.download = (this.settings.fileName || "epalSystemReport") + "all_stat" + ".csv";
            a.click();
        });
    }


    prepareColumnMap(): void {

        for (const key in this.settings.columns) {

            if (!this.settings.columns.hasOwnProperty(key)) {
                continue;
            }

            const title: string = this.settings.columns[key]["title"];
            let column: TableColumn = new TableColumn();
            column.type = this.settings.columns[key]["type"];
            column.title = this.settings.columns[key]["title"];
            column.field = key;
            column.isDisplay = this.settings.columns[key]["isDisplay"];
            column.isExport = this.settings.columns[key]["isExport"];
            column.valuePrepareFunction = this.settings.columns[key]["valuePrepareFunction"];
            this.columnMap.set(column.field, column);

            if (this.settings.columns[key].isDisplay === false) {
                delete this.settings.columns[key];
            }
        }
    }

}
