import React from "react";
import DateMomentUtils from '@date-io/moment';
import "moment/locale/ca";
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

function Dates({ conf, setConf, selectPostsByDateAndCategory }) {

  const handleDateChange = date => d => {
    const dateFrom = date === 'from' ? d : conf.dateFrom;
    const dateTo = date === 'to' ? d : conf.dateTo;
    if (dateFrom > dateTo)
      setConf({ ...conf, err: 'Error: La data inicial ha de ser anterior o igual a la final!' });
    else {
      selectPostsByDateAndCategory(dateFrom, dateTo);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateMomentUtils} locale="ca">
      <div>
        <h3>Interval de dates per als articles</h3>
        <DatePicker
          className="date"
          keyboard
          label="Data inicial"
          format="DD/MM/YYYY"
          disableOpenOnEnter
          value={conf.dateFrom}
          onChange={handleDateChange('from')}
        />
        <DatePicker
          className="date"
          keyboard
          label="Data final"
          format="DD/MM/YYYY"
          disableOpenOnEnter
          value={conf.dateTo}
          onChange={handleDateChange('to')}
        />
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default Dates;