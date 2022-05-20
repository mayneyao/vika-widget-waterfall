import { initializeWidget, useActiveViewId, useFields, useRecords } from '@vikadata/widget-sdk';
import React from 'react';
import { Chart } from "react-google-charts";



export const HelloWorld: React.FC = () => {
  const viewId = useActiveViewId()
  const records = useRecords(viewId)
  const fields = useFields(viewId);
  const fieldNameIdMap = fields.reduce((acc, field) => {
    acc[field.name] = field.id;
    return acc;
  }, {});

  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];



  const options = {
    // width: 2000,
    height: 2000,
    gantt: {
      defaultStartDate: null,
    }
    // gantt: {
    //   defaultStartDateMillis: 1653016820508,
    // },
  };

  const rows = records.map(record => {
    const start = new Date(record.getCellValue(fieldNameIdMap['startAt']))
    const end = new Date(record.getCellValue(fieldNameIdMap['endAt']))
    return [
      record.getCellValue(fieldNameIdMap['id']),
      record.getCellValue(fieldNameIdMap['name']),
      record.getCellValue(fieldNameIdMap['resourceId']),
      start,
      end,
      end.getTime() - start.getTime(),
      100, //record.getCellValue(fieldNameIdMap['percent']),
      null,//record.getCellValue(fieldNameIdMap['dependencies']),
    ]
  })

  const data = [columns, ...rows];

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
      <Chart
        chartType="Gantt"
        width="100%"
        height="100%"
        data={data}
        options={options}
      />
      {/* <Setting /> */}
    </div>
  );
};

initializeWidget(HelloWorld, process.env.WIDGET_PACKAGE_ID);
