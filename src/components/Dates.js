import React from "react";
import DateMomentUtils from '@date-io/moment';
import "moment/locale/ca";
import "moment/locale/es";
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

function Dates({ conf, setConf, selectPostsByDateAndCategory, t, i18n }) {

  const { dateFrom, dateTo, dateFirst } = conf;

  const handleDateChange = whichDate => moment => {
    const from = whichDate === 'from' ? moment.toDate() : dateFrom;
    const to = whichDate === 'to' ? moment.toDate() : dateTo;
    if (from > to)
      setConf({ ...conf, err: t('date_err1') });
    else {
      selectPostsByDateAndCategory(from, to);
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
        <p className="dateFirstNote">{t('first_date')} {dateFirst.toLocaleDateString()}</p>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default Dates;