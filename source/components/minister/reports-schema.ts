
export class TableColumn {
  field: string;
  title: string;
  type: string;
  isDisplay: boolean;
  isExport: boolean;
  valuePrepareFunction: Function;
}

export class reportsSchema  {

  /*
  defaultSettings = {
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: false,
      delete: false
    },
    pager: {
      display: true,
      perPage: 50
    }
  };
  */

genReportSchema = {
  actions: false,
  noDataMessage: 'Δεν υπάρχουν δεδομένα που περιέχουν το κείμενο αναζήτησης',
  columns: {
    name: {
      title: 'Κατηγορία',
      filter: false
    },
    numStudents: {
      title: 'Αριθμός',
      filter: false
    }
  }
};

reportAllStatSchema = {
  actions: false,
  pager : {
    display : true,
    perPage:10
  },
  noDataMessage: 'Δεν υπάρχουν δεδομένα που περιέχουν το κείμενο αναζήτησης',
  columns: {
    name: {
      title: 'Σχολείο',
      width: '18%',
      filter: false
    },
    region: {
      title: 'Περιφερειακή Διεύθυνση',
      width: '15%',
      filter: false
    },
    admin: {
      title: 'Διεύθυνση Εκπαίδευσης',
      width: '15%',
      filter: false
    },
    section: {
      title: 'Τάξη/Τομέας/Ειδικότητα',
      width: '18%',
      filter: false
    },
    num: {
      title: 'Αριθμός Μαθητών',
      width: '8%',
      filter: false
    },
    capacity: {
      title: 'Χωρ/κα',
      width: '8%',
      filter: false
    },
    percentage: {
      title: 'Ποσοστό (%)',
      width: '8%',
      filter: false
    }
  }
};





reportCompletenessSchema = {
  actions: false,
  noDataMessage: 'Δεν υπάρχουν δεδομένα που περιέχουν το κείμενο αναζήτησης',
  columns: {
    name: {
      title: 'Σχολείο',
      width: '17%',
      filter: false
    },
    region: {
      title: 'ΠΔΕ',
      width: '13%',
      filter: false
    },
    admin: {
      title: 'ΔΙΔΕ',
      width: '13%',
      filter: false
    },
    percTotal: {
      title: 'Πληρότητα Σχολείου',
      width: '11%',
      filter: false
    },
    percA: {
      title: 'Πληρότητα Α\' τάξης (%)',
      width: '11%',
      filter: false
    },
    percB: {
      title: 'Πληρότητα Β\' τάξης (%)',
      width: '11%',
      filter: false
    },
    percC: {
      title: 'Πληρότητα Γ\' τάξης (%)',
      width: '11%',
      filter: false
    }
  }
};


constructor() {}

}
