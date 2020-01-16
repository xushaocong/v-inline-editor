let defaultToolbar = {
  buttons: {
    bold: {className: 'bold', action: 'bold', title: '加粗', native: true, active: false},
    italic: {className: 'italic', action: 'italic', title: '斜体', native: true, active: false},
    underline: {className: 'underline', action: 'underline', title: '下划线', native: true, active: false},
    strikeThrough: {className: 'strikethrough', action: 'strikeThrough', title: '删除线', native: true, active: false},

    superscript: {className: 'superscript', action: 'superscript', title: '上标', native: true, active: false},
    subscript: {className: 'subscript', action: 'subscript', title: '下标', native: true, active: false},

    justifyLeft: {className: 'align-left', action: 'justifyLeft', title: '左对齐', native: true, active: false},
    justifyCenter: {className: 'align-center', action: 'justifyCenter', title: '居中对齐', native: true, active: false},
    justifyRight: {className: 'align-right', action: 'justifyRight', title: '右对齐', native: true, active: false},

    link: {className: 'link', title: '链接'},
    unLink: {className: 'unlink', action: 'unLink', title: '取消链接'},

    removeFormat: {className: 'eraser', action: 'removeFormat', title: '清除样式', native: true}
  },

  selects: {
    fontName: {className: '', value: ''},
    fontSize: {className: '', value: ''}
  },

  colorPickers: {
    foreColor: {className: 'fore-color', value: '', title: '文字颜色'},
    backColor: {className: 'back-color', value: '', title: '文字背景'}
  }
};
let toolbar = JSON.parse(JSON.stringify(defaultToolbar));

export function resetToolbar () {
  toolbar = JSON.parse(JSON.stringify(defaultToolbar));
}
export function modifyToolbar (name, element) {
  if (element.type === 'button') {
    toolbar.buttons[name] = {
      className: element.className
    };
    element.action && (toolbar.buttons[name].action = element.action);
  } else {
    toolbar.selects[name] = {
      className: element.className
    };
  }
}
export function getToolbar () {
  return toolbar;
}
