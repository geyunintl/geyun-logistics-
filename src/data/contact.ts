export const quoteFields = [
  { name: 'name', label: '姓名', type: 'text', placeholder: '请输入姓名' },
  { name: 'contact', label: '电话/微信', type: 'text', placeholder: '便于方案顾问联系' },
  { name: 'company', label: '公司名称', type: 'text', placeholder: '选填' },
  { name: 'city', label: '发货城市', type: 'text', placeholder: '如：义乌 / 深圳' },
  { name: 'country', label: '目的国家', type: 'text', placeholder: '如：美国' },
  { name: 'cargo', label: '货物类型', type: 'text', placeholder: '如：普货 / 带电 / 大货' },
  { name: 'volume', label: '预计货量', type: 'text', placeholder: '如：10CBM / 500KG' },
  { name: 'fba', label: '是否进FBA', type: 'select', options: ['是', '否', '待确认'] },
  { name: 'warehouse', label: '是否需要海外仓', type: 'select', options: ['需要', '不需要', '待确认'] },
  { name: 'priority', label: '方案偏好', type: 'select', options: ['时效优先', '成本优先', '平衡方案'] },
  { name: 'remark', label: '备注', type: 'textarea', placeholder: '请补充货物、渠道或仓库要求' },
];
