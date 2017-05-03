
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
  columns: {
    name: {
      title: 'Σχολείο',
      filter: false
    },
    section: {
      title: 'Τάξη/Τομέας/Ειδικότητα',
      filter: false
    },
    num: {
      title: 'Αριθμός Μαθητών',
      filter: false
    }
  }
};


reportCompletenessSchemaFull = {
  actions: false,
  columns: {
    name: {
      title: 'Σχολείο',
      filter: false,
      hide: true
    },
    numStudents: {
      title: 'Αριθμός',
      filter: false
    },
    capacityTotal: {
      title: 'Χωρ/τα',
      filter: false
    },
    percTotal: {
      title: 'Πληρότητα',
      filter: false
    },
    numStudentsA: {
      title: 'Α Τάξη',
      filter: false
    },
    capacityA: {
      title: 'Χωρ/τα',
      filter: false
    },
    percA: {
      title: 'Πληρότητα',
      filter: false
    },
    numStudentsB: {
      title: 'Β Τάξη',
      filter: false
    },
    capacityB: {
      title: 'Χωρ/τα',
      filter: false
    },
    percB: {
      title: 'Πληρότητα',
      filter: false
    },
    numStudentsC: {
      title: 'Γ Τάξη',
      filter: false
    },
    capacityC: {
      title: 'Χωρ/τα',
      filter: false
    },
    percC: {
      title: 'Πληρότητα',
      filter: false
    }
  }
};


reportCompletenessSchema = {
  actions: false,
  columns: {
    name: {
      title: 'Σχολείο',
      filter: false
    },
    percTotal: {
      title: 'Πληρότητα Σχολείου',
      filter: false
    },
    percA: {
      title: 'Πληρότητα Α\' τάξης',
      filter: false
    },
    percB: {
      title: 'Πληρότητα Β\' τάξης',
      filter: false
    },
    percC: {
      title: 'Πληρότητα Γ\' τάξης',
      filter: false
    }
  }
};


constructor() {}

}
