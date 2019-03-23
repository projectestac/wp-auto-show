import React from "react";
import DateMomentUtils from '@date-io/moment';
import "moment/locale/ca";
import "moment/locale/es";
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

function Dates({ conf, setConf, selectPostsByDateAndCategory, t, i18n }) {

  const handleDateChange = date => d => {
    const dateFrom = date === 'from' ? d : conf.dateFrom;
    const dateTo = date === 'to' ? d : conf.dateTo;
    if (dateFrom > dateTo)
      setConf({ ...conf, err: t('date_err1') });
    else {
      selectPostsByDateAndCategory(dateFrom, dateTo);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateMomentUtils} locale={i18n.language}>
      <div>
        <h3>{t('date_range')}</h3>
        <DatePicker
          className="date"
          keyboard
          label={t('initial_date')}
          format="DD/MM/YYYY"
          disableOpenOnEnter
          value={conf.dateFrom}
          onChange={handleDateChange('from')}
        />
        <DatePicker
          className="date"
          keyboard
          label={t('end_date')}
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