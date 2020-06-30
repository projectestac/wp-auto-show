import React from "react";
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import "moment/locale/ca";
import "moment/locale/es";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

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
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={i18n.language}>
      <div>
        <h3>{t('date_range')}</h3>
        <KeyboardDatePicker
          className="date"
          label={t('initial_date')}
          format="DD/MM/yyyy"
          value={conf.dateFrom}
          onChange={handleDateChange('from')}
        />
        <KeyboardDatePicker
          className="date"
          label={t('end_date')}
          format="DD/MM/yyyy"
          value={conf.dateTo}
          onChange={handleDateChange('to')}
        />
        <p className="dateFirstNote">{t('first_date')} {dateFirst.toLocaleDateString()}</p>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default Dates;