
export class TableColumn {
    field: string;
    title: string;
    type: string;
    isDisplay: boolean;
    isExport: boolean;
    valuePrepareFunction: Function;
}

export class ReportsSchema {

    ReportUsersSchema = {
        actions: false,
        fileName: "e-ΕΠΑΛ Αριθμός Αιτήσεων - Εγγεγραμμένων Χρηστών",
        noDataMessage: "Δεν υπάρχουν δεδομένα που περιέχουν το κείμενο αναζήτησης",
        columns: {
            name: {
                title: "Περιγραφή",
                filter: false
            },
            numStudents: {
                title: "Αριθμός",
                filter: false
            }
        }
    };

    genReportSchema = {
        actions: false,
        fileName: "e-ΕΠΑΛ Κατανομή Μαθητών με Βάση τη Σειρά Προτίμησης",
        noDataMessage: "Δεν υπάρχουν δεδομένα που περιέχουν το κείμενο αναζήτησης",
        columns: {
            name: {
                title: "Κατηγορία",
                filter: false
            },
            numStudents: {
                title: "Αριθμός",
                filter: false
            }
        }
    };

    reportAllStatSchema = {
        actions: false,
        fileName: "e-ΕΠΑΛ Αναφορά",
        pager: {
            display: true,
            perPage: 10
        },
        noDataMessage: "Δεν υπάρχουν δεδομένα που περιέχουν το κείμενο αναζήτησης",
        columns: {
            name: {
                title: "Σχολείο",
                width: "18%",
                filter: false
            },
            region: {
                title: "Περιφερειακή Διεύθυνση",
                width: "15%",
                filter: false
            },
            admin: {
                title: "Διεύθυνση Εκπαίδευσης",
                width: "15%",
                filter: false
            },
            section: {
                title: "Τάξη/Τομέας/Ειδικότητα",
                width: "18%",
                filter: false
            },
            num: {
                title: "Αριθμός Μαθητών",
                width: "8%",
                filter: false
            },
            capacity: {
                title: "Χωρ/κα",
                width: "8%",
                filter: false
            },
            percentage: {
                title: "Ποσοστό (%)",
                width: "8%",
                filter: false
            }
        }
    };

    reportNoCapacity = {
        actions: false,
        fileName: "e-ΕΠΑΛ Σχολικές μονάδες που δεν έχουν δηλώσει Χωρητικότητα τμημάτων",
        pager: {
            display: true,
            perPage: 10
        },
        noDataMessage: "Δεν υπάρχουν δεδομένα που περιέχουν το κείμενο αναζήτησης",
        columns: {
            name: {
                title: "Σχολείο",
                width: "22%",
                filter: false
            },
            region: {
                title: "Περιφερειακή Διεύθυνση",
                width: "20%",
                filter: false
            },
            admin: {
                title: "Διεύθυνση Εκπαίδευσης",
                width: "20%",
                filter: false
            },
            section: {
                title: "Τάξη/Τομέας/Ειδικότητα",
                width: "22%",
                filter: false
            },
            capacity: {
                title: "Χωρητικότητα",
                width: "15%",
                filter: false
            }
        }
    };

    reportCompletenessSchema = {
        actions: false,
        fileName: "e-ΕΠΑΛ Συνολική Πληρότητα σχολικών μονάδων ΕΠΑΛ ανά τάξη",
        noDataMessage: "Δεν υπάρχουν δεδομένα που περιέχουν το κείμενο αναζήτησης",
        columns: {
            name: {
                title: "Σχολείο",
                width: "15%",
                filter: false
            },
            region: {
                title: "ΠΔΕ",
                width: "10%",
                filter: false
            },
            admin: {
                title: "ΔΙΔΕ",
                width: "10%",
                filter: false
            },
            percTotal: {
                title: "% Σχολείου",
                width: "10%",
                filter: false
            },
            percA: {
                title: "% Α\" τάξης",
                width: "10%",
                filter: false
            },
            percB: {
                title: "% Β\" τάξης",
                width: "10%",
                filter: false
            },
            percC: {
                title: "% Γ\" τάξης",
                width: "10%",
                filter: false
            },
            percD: {
                title: "% Δ\" τάξης",
                width: "10%",
                filter: false
            }
        }
    };

    constructor() { }

}
