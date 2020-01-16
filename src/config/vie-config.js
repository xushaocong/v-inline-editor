let defaultConf = {
  toolbar: [
    'fontName', 'fontSize',
    'foreColor', 'backColor',
    'bold', 'italic', 'underline', 'strikeThrough',
    'superscript', 'subscript',
    'justifyLeft', 'justifyCenter', 'justifyRight',
    'removeFormat'
  ],
  fontName: [
    { value: '微软雅黑', label: '微软雅黑' },
    { value: '宋体', label: '宋体' },
    { value: '仿宋', label: '仿宋' },
    { value: 'serif', label: 'Serif' },
    { value: 'Helvetica', label: 'Helvetica' }
  ],
  fontSize: [
    { value: '12px', label: '12px' },
    { value: '14px', label: '14px' },
    { value: '16px', label: '16px' },
    { value: '18px', label: '18px' },
    { value: '20px', label: '20px' },
    { value: '24px', label: '24px' },
    { value: '28px', label: '28px' },
    { value: '32px', label: '32px' },
    { value: '48px', label: '48px' }
  ]
};

export function getConfig (name) {
  let config = JSON.parse(JSON.stringify(defaultConf));
  return name ? config[name] : config;
}
export function getDefaultConf () {
  return defaultConf;
}
