'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));

var defaultToolbar = {
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
var toolbar = JSON.parse(JSON.stringify(defaultToolbar));
function getToolbar () {
  return toolbar;
}

var defaultConf = {
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

function getConfig (name) {
  var config = JSON.parse(JSON.stringify(defaultConf));
  return name ? config[name] : config;
}

var isServer = Vue.prototype.$isServer;
var on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
}());

var nodeList = [];
var ctx = '@@clickoutsideContext';

var startClick;
var seed = 0;

!Vue.prototype.$isServer && on(document, 'mousedown', function (e) { return (startClick = e); });

!Vue.prototype.$isServer && on(document, 'mouseup', function (e) {
  nodeList.forEach(function (node) { return node[ctx].documentHandler(e, startClick); });
});

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
var Clickoutside = {
  bind: function bind (el, binding, vnode) {
    nodeList.push(el);
    // eslint-disable-next-line no-plusplus
    var id = seed++;
    var documentHandler = function (mouseup, mousedown) {
      if ( mouseup === void 0 ) mouseup = {};
      if ( mousedown === void 0 ) mousedown = {};

      if (!vnode.context ||
                !mouseup.target ||
                !mousedown.target ||
                el.contains(mouseup.target) ||
                el.contains(mousedown.target) ||
                el === mouseup.target ||
                (vnode.context.popperElm &&
                (vnode.context.popperElm.contains(mouseup.target) ||
                vnode.context.popperElm.contains(mousedown.target)))) { return; }

      if (binding.expression &&
                el[ctx].methodName &&
                vnode.context[el[ctx].methodName]) {
        vnode.context[el[ctx].methodName]();
      } else {
        el[ctx].bindingFn && el[ctx].bindingFn();
      }
    };
    el[ctx] = {
      id: id,
      documentHandler: documentHandler,
      methodName: binding.expression,
      bindingFn: binding.value
    };
  },

  update: function update (el, binding) {
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },

  unbind: function unbind (el) {
    var len = nodeList.length;

    for (var i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
  }
};

//
var script = {
  name: 'ColorPicker',
  directives: { Clickoutside: Clickoutside },
  props: {
    value: {
      type: String,
      required: true
    },
    defaultColor: {
      type: String,
      default: '#666'
    },
    position: {
      type: String,
      default: 'left'
    }
  },
  data: function data() {
    return {
      openStatus: false,
      hoverColor: null,
      themeColor: ['#000', '#fff', '#ffebcd', '#ff8000', '#ffc12a', '#448026', '#ffff00', '#ff0000', '#0000ff'],
      colorPanel: [
        ['#400000', '#804000', '#004000', '#004040'],
        ['#808000', '#808040', '#808080', '#408080'],
        ['#ff8080', '#ff0000', '#804040', '#800000'],
        ['#ffff90', '#ffff00', '#ff8040', '#ff8000'],
        ['#80ff80', '#80ff00', '#00ff00', '#008000'],
        ['#00ff80', '#00ff40', '#008080', '#008040'],
        ['#80ffff', '#00ffff', '#004080', '#0000ff'],
        ['#0080ff', '#0080c0', '#8080ff', '#0000a0'],
        ['#ff80c0', '#8080c0', '#800040', '#800080'],
        ['#ff80ff', '#ff00ff', '#ff0080', '#8000ff']
      ],
      inputColor: this.value
    };
  },
  computed: {
    showPanelColor: function showPanelColor() {
      if (this.hoverColor) {
        return this.hoverColor;
      } else {
        return this.showColor;
      }
    },
    showColor: function showColor() {
      return this.value || '';
    }
  },
  methods: {
    closeColorPanel: function closeColorPanel() {
      this.openStatus = false;
    },
    toggleStatus: function toggleStatus() {
      this.openStatus = !this.openStatus;
    },
    showMoreColor: function showMoreColor() {
      this.$refs.colorPickerInput.click();
    },
    updateValue: function updateValue(value) {
      if (value) {
        this.$emit('input', value);
        this.$emit('change', value);
        this.openStatus = false;
      }
    },
    handleDefaultColor: function handleDefaultColor() {
      this.updateValue(this.defaultColor);
    },

    /**
     * 格式化 hex 颜色值
     */
    parseColor: function parseColor(hexStr) {
      if (hexStr.length === 4) {
        hexStr = '#' + hexStr[1] + hexStr[1] + hexStr[2] + hexStr[2] + hexStr[3] + hexStr[3];
      } else {
        return hexStr;
      }
    },

    /**
     * RGB 颜色 转 HEX 颜色
     */
    rgbToHex: function rgbToHex(r, g, b) {
      var hex = ((r << 16) | (g << 8) | b).toString(16);
      return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
    },

    /**
     * HEX 转 RGB 颜色
     */
    hexToRgb: function hexToRgb(hex) {
      hex = this.parseColor(hex);
      var rgb = [];
      for (var i = 1; i < 7; i += 2) {
        rgb.push(parseInt('0x' + hex.slice(i, i + 2)));
      }
      return rgb;
    },

    /**
     * 计算渐变过渡颜色
     */
    gradient: function gradient(startColor, endColor, step) {
      // 讲 hex 转换为 rgb
      var sColor = this.hexToRgb(startColor);
      var eColor = this.hexToRgb(endColor);
      // 计算R\G\B每一步的差值
      var rStep = (eColor[0] - sColor[0]) / step;
      var gStep = (eColor[1] - sColor[1]) / step;
      var bStep = (eColor[2] - sColor[2]) / step;
      var gradientColorArr = [];
      // 计算每一步的hex值
      for (var i = 0; i < step; i++) {
        gradientColorArr.push(
          this.rgbToHex(
            parseInt(rStep * i + sColor[0]),
            parseInt(gStep * i + sColor[1]),
            parseInt(bStep * i + sColor[2])
          )
        );
      }
      return gradientColorArr;
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
var __vue_script__ = script;
/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:(_vm.closeColorPanel),expression:"closeColorPanel"}],staticClass:"color-picker"},[_c('button',{staticClass:"color-picker__trigger",on:{"click":_vm.toggleStatus}},[_vm._t("icon")],2),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.inputColor),expression:"inputColor"}],ref:"colorPickerInput",staticClass:"color-picker__input",attrs:{"type":"color"},domProps:{"value":(_vm.inputColor)},on:{"change":function($event){return _vm.updateValue(_vm.inputColor)},"input":function($event){if($event.target.composing){ return; }_vm.inputColor=$event.target.value;}}}),_vm._v(" "),_c('div',{staticClass:"color-picker__panel",class:{ open: _vm.openStatus },style:((_vm.position + ": 0"))},[_c('div',{staticClass:"color-picker__panel-header"},[(_vm.showPanelColor === 'transparent')?_c('div',{staticClass:"color-transparent"}):_c('div',{staticClass:"color-view",style:(("background-color: " + _vm.showPanelColor))}),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.showPanelColor),expression:"showPanelColor"}],staticClass:"color-value",attrs:{"type":"text","readonly":""},domProps:{"value":(_vm.showPanelColor)},on:{"input":function($event){if($event.target.composing){ return; }_vm.showPanelColor=$event.target.value;}}})]),_vm._v(" "),_c('div',{staticClass:"color-picker__panel-body"},[_c('h3',[_vm._v("主题颜色")]),_vm._v(" "),_c('ul',{staticClass:"theme-color"},[_c('button',{staticClass:"button-transparent",on:{"mouseover":function($event){_vm.hoverColor = 'transparent';},"mouseout":function($event){_vm.hoverColor = null;},"click":function($event){return _vm.updateValue('transparent')}}},[_c('i',{staticClass:"iconfont icon-slash"})]),_vm._v(" "),_vm._l((_vm.themeColor),function(color,index){return _c('button',{key:index,style:({ backgroundColor: color }),on:{"mouseover":function($event){_vm.hoverColor = color;},"mouseout":function($event){_vm.hoverColor = null;},"click":function($event){return _vm.updateValue(color)}}})})],2),_vm._v(" "),_c('h3',[_vm._v("标准颜色")]),_vm._v(" "),_c('ul',{staticClass:"base-color"},_vm._l((_vm.colorPanel),function(item,index){return _c('li',{key:index},[_c('ul',_vm._l((item),function(color){return _c('button',{key:color,style:({ backgroundColor: color }),on:{"mouseover":function($event){_vm.hoverColor = color;},"mouseout":function($event){_vm.hoverColor = null;},"click":function($event){return _vm.updateValue(color)}}})}),0)])}),0),_vm._v(" "),_c('button',{staticClass:"more-color",on:{"click":_vm.showMoreColor}},[_vm._v("\n        更多颜色\n      ")])])])])};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

//
var script$1 = {
  name: 'VieToolbar',
  components: {
    ColorPicker: __vue_component__
  },
  props: {},
  data: function data() {
    var ref = getToolbar();
    var buttons = ref.buttons;
    var selects = ref.selects;
    var colorPickers = ref.colorPickers;
    return {
      options: null,
      buttons: buttons,
      selects: selects,
      colorPickers: colorPickers,
      config: getConfig(),
      toolbar: getConfig('toolbar')
    };
  },
  mounted: function mounted() {
    if (this.options) {
      if (this.options.toolbar) {
        this.toolbar = this.options.toolbar;
        this.config.toolbar = this.options.toolbar;
      }
      if (this.options.fontSize) {
        this.config.fontSize = this.options.fontSize;
      }
      if (this.options.fontName) {
        this.config.fontName = this.options.fontName;
      }
    }
  },
  methods: {
    btnHandler: function btnHandler(evt, button) {
      var btn = this.buttons[button];
      if (btn.action) {
        if (btn.native) {
          this.$emit('execCommand', { name: button, value: null });
        }
      }
    },
    selectHandler: function selectHandler(evt, select) {
      this.$emit('execCommand', { name: select, value: this.selects[select].value });
    },
    colorPickerHandle: function colorPickerHandle(color, cp) {
      this.$emit('execCommand', { name: cp, value: color });
    }
  }
};

/* script */
var __vue_script__$1 = script$1;
/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"toolbar",staticClass:"vie-toolbar",staticStyle:{"top":"-9999px"}},[_vm._l((_vm.toolbar),function(item,index){return [(item in _vm.buttons)?_c('button',{key:index,staticClass:"button",class:{active: _vm.buttons[item].active},attrs:{"title":_vm.buttons[item].title,"unselectable":"on"},on:{"click":function($event){$event.stopPropagation();return _vm.btnHandler($event, item)}}},[_c('svg',{staticClass:"icon",attrs:{"aria-hidden":"true"}},[_c('use',{attrs:{"xlink:href":'#icon-' + [_vm.buttons[item].className]}})])]):(item in _vm.selects)?_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.selects[item].value),expression:"selects[item].value"}],key:index,staticClass:"select",attrs:{"unselectable":"on"},on:{"change":[function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(_vm.selects[item], "value", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);},function($event){return _vm.selectHandler($event, item)}]}},_vm._l((_vm.config[item]),function(op,i){return _c('option',{key:i,domProps:{"value":op.value}},[_vm._v("\n        "+_vm._s(op.label)+"\n      ")])}),0):(item in _vm.colorPickers)?_c('color-picker',{key:index,attrs:{"title":_vm.colorPickers[item].title,"unselectable":"on"},on:{"change":function($event){return _vm.colorPickerHandle($event, item)}},model:{value:(_vm.colorPickers[item].value),callback:function ($$v) {_vm.$set(_vm.colorPickers[item], "value", $$v);},expression:"colorPickers[item].value"}},[_c('svg',{staticClass:"icon",attrs:{"slot":"icon","aria-hidden":"true"},slot:"icon"},[_c('use',{attrs:{"xlink:href":'#icon-' + [_vm.colorPickers[item].className]}})])]):_vm._e()]})],2)};
var __vue_staticRenderFns__$1 = [];

  /* style */
  var __vue_inject_styles__$1 = undefined;
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$1 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

(function(window){var svgSprite='<svg><symbol id="icon-underline" viewBox="0 0 1024 1024"><path d="M0 945.230769 945.230769 945.230769 945.230769 1024 0 1024 0 945.230769ZM0 0 407.076943 0 407.076943 61.934356 319.153861 68.127823 299.076923 86.088783 299.076923 530.158041C299.076923 614.802038 317.076716 675.290663 353.076933 711.625649 389.077071 747.960635 448.153442 766.127892 530.307702 766.127892 606.000364 766.127892 660.807522 746.825177 694.730752 708.219274 728.653982 669.613371 745.61536 606.337733 745.61536 518.390469L745.61536 91.043525 724.153817 69.366469 633.461524 61.934356 633.461524 0 955.384596 0 955.384596 61.934356 868.846119 69.366469 849.461563 91.043525 849.461563 531.396687C849.461563 649.072561 819.923338 734.334661 760.846178 787.185585 701.76894 840.03651 606.462188 866.461538 474.923087 866.461538 406.153531 866.461538 345.807951 857.481137 293.884613 839.520098 241.961275 821.55906 201.230887 795.856581 171.692347 762.411796 149.076834 735.986373 133.038474 705.74206 123.57695 671.677991 114.115348 637.613922 109.384625 588.789524 109.384625 525.203298L109.384625 86.088783 89.307687 68.127823 0 61.934356 0 0Z"  ></path></symbol><symbol id="icon-italic" viewBox="0 0 1024 1024"><path d="M897.948 61.745l0 64.322-128.65 0L447.674 897.933l128.65 0 0 64.32L126.052 962.253l0-64.32 128.65 0 321.622-771.866-128.65 0L447.674 61.745 897.948 61.745z"  ></path></symbol><symbol id="icon-eraser" viewBox="0 0 1024 1024"><path d="M674.37504 69.888a20.224 20.224 0 0 0-28.48 0L6.08704 709.76a20.224 20.224 0 0 0 0 28.544l124.416 124.416a56.128 56.128 0 0 0 34.432 14.272h398.656c11.072 0 26.56-6.4 34.432-14.272l420.288-420.352a20.224 20.224 0 0 0 0-28.544l-343.936-343.936zM558.47104 786.816a56.128 56.128 0 0 1-34.496 14.272H215.36704a56.128 56.128 0 0 1-34.432-14.272l-58.624-58.688a20.224 20.224 0 0 1 0-28.544l234.496-234.56a20.224 20.224 0 0 1 28.544 0l233.152 233.216a20.224 20.224 0 0 1 0 28.48l-60.032 60.096z" fill="#666666" ></path></symbol><symbol id="icon-bold" viewBox="0 0 1024 1024"><path d="M163.89832738 853.08066132v-683.98678637c7.86353164-67.26127551-39.59849673-98.92602915-142.38608023-95.27510424v-56.02765746h539.77524244c245.17366619 3.72113633 371.62205369 86.00737034 379.6260058 246.64807746 0 119.63800812-79.12678203 190.62041997-237.23992553 213.0174397 197.64142881 29.97971286 296.56745795 112.12552887 296.56746036 246.6480799-11.86550645 183.17814974-140.42019855 276.69800181-385.59386476 280.34892423h-593.13491831v-56.09786893c102.78758595 3.79134534 150.24961188-28.01382876 142.38608023-95.27510429z m243.13757553-336.37658413v313.97956197c-3.93176586 74.77375474 31.66475361 110.22985619 106.78956074 106.50872232 150.24961188-3.72113633 225.4446281-67.33148452 225.44462812-190.62041999-4.00197481-153.19843689-79.19699103-229.86786431-225.44462812-229.8678643h-106.78956074z m0-336.37658662v274.73212011h47.46202592c154.25158671 0 229.30618487-59.7487938 225.44462803-179.38680435-4.00197481-123.35914447-61.36362558-186.82907463-172.01474319-190.62042003-67.33148452 0-100.89191329 31.80517407-100.89191076 95.27510427z" fill="#8FA6BF" ></path></symbol><symbol id="icon-back-color" viewBox="0 0 1024 1024"><path d="M327 167h-1.9c-2.8 17.7-5.9 31.4-9.5 41l-88 244.3h197.2L336.1 208c-2.8-7.9-5.8-21.5-9.1-41zM203.6 518.6l-56.5 160.7h361.2l-60-160.7z" fill="#656565" ></path><path d="M592.3 91.8H64v585.7L287.1 91.8h81.3l223.7 587.5h0.2z" fill="#656565" ></path><path d="M64 677.5l-0.7 1.9h83.8v-0.1H64zM508.3 679.4h83.8v-0.1h-83.8z" fill="" ></path><path d="M287.1 91.8L64 677.5v1.8h83.1l56.5-160.8h244.7l60 160.8h83.8L368.4 91.8h-81.3z m-59.5 360.4l88-244.3c3.6-9.6 6.7-23.3 9.5-41h1.9c3.3 19.5 6.4 33.1 9.1 41l88.7 244.3H227.6zM502 886H64.4V702.8H502V886z m-377.6-60H442v-63.2H124.4V826zM959.3 703.8L743.7 926.2 528 703.8z" fill="#919191" ></path></symbol><symbol id="icon-fore-color" viewBox="0 0 1024 1024"><path d="M388.4 87.8h-81.3L83.3 675.4h83.8l56.5-160.8h244.7l60 160.8h83.8L388.4 87.8zM247.6 448.2l88-244.3c3.6-9.6 6.7-23.3 9.5-41h1.9c3.3 19.5 6.4 33.1 9.1 41l88.7 244.3H247.6z" fill="#919191" ></path><path d="M84 704.8h429v173.6H84z" fill="#656565" ></path><path d="M548 704.8l215.7 222.4 215.6-222.4z" fill="#919191" ></path></symbol><symbol id="icon-align-left" viewBox="0 0 1024 1024"><path d="M1000.15484777 196.33978785H27.32487111V69.5786003H1000.15484777v126.76118755zM634.61866509 450.41228994H27.32487111V323.65110239H634.61866509v126.76118755z m365.53618268 252.97224814H27.32487111V576.62335052H1000.15484777v126.76118756z m-365.53618268 254.07250209H27.32487111v-126.76118756H634.61866509v126.76118756z" fill="" ></path></symbol><symbol id="icon-align-right" viewBox="0 0 1024 1024"><path d="M34.02666667 76.05333333h956.05333333v124.58666667H34.02666667zM393.17333333 325.76h596.8v124.58666667H393.17333333zM34.02666667 574.4h956.05333333v124.58666667H34.02666667zM393.17333333 824h596.8v124.58666667H393.17333333z"  ></path></symbol><symbol id="icon-align-center" viewBox="0 0 1024 1024"><path d="M34.45333333 77.86666667h954.56v124.37333333H34.45333333zM213.76 327.25333333H809.6v124.37333334H213.76zM34.45333333 575.46666667h954.56v124.37333333H34.45333333zM213.76 824.74666667H809.6v124.37333333H213.76z"  ></path></symbol><symbol id="icon-subscript" viewBox="0 0 1024 1024"><path d="M781.2 383h-26.6c-4.9-47.4-18.1-82.1-39.5-104.1C688 251.1 649.3 237.2 599.2 237.2H480v507c0 51.5 5.8 84.3 17.3 98.2 14.8 17.2 39.1 25.8 72.8 25.8h29.6v23.4H240.6v-23.4h30.7c34.4 0 59.8-11 76.2-33.1 8.2-13.9 12.3-44.2 12.3-90.8V237.3H259.3c-55.6 0-93.5 9-114 27-30.2 22-47.8 61.7-52.7 118.8H63.9l-0.3-208.7h717.3l0.3 208.6zM901 134.8h19.9V323.9c0 8.9 0.6 14.7 1.7 17.2 1.1 2.6 3 4.5 5.6 5.8s7.8 2 15.5 2h16v18.8H844.5v-18.8h17.8c7.7 0 12.9-0.7 15.4-2 2.6-1.4 4.5-3.5 6-6.5 1.4-3 2.1-8.5 2.1-16.4V173.5h-41.3v-19.1c22.5-3.2 41.4-9.7 56.5-19.6z"  ></path></symbol><symbol id="icon-strikethrough" viewBox="0 0 1024 1024"><path d="M959.6 324.6h-33.2c-6.2-59.1-22.6-102.5-49.3-130-33.9-34.7-82.1-52-144.7-52H583.5v633c0 64.4 7.2 105.2 21.6 122.6 18.5 21.5 48.8 32.2 90.9 32.2h37v29.2H284.6v-29.2h38.3c43 0 74.7-13.8 95.1-41.4 10.2-17.4 15.3-55.1 15.3-113.4v-633H307.9c-69.4 0-116.8 11.2-142.3 33.7-37.7 27.5-59.7 77-65.8 148.4H64L63.6 64h895.7l0.3 260.6z"  ></path><path d="M65.9 439.5H959v91.6H65.9z"  ></path></symbol><symbol id="icon-superscript" viewBox="0 0 1024 1024"><path d="M875.8 325.2h-30.1c-5.6-53.5-20.5-92.8-44.6-117.7-30.7-31.4-74.3-47.1-131-47.1H535.4v573.1c0 58.3 6.5 95.3 19.5 111 16.7 19.4 44.2 29.1 82.3 29.1h33.5v26.5h-406v-26.5h34.7c38.9 0 67.6-12.5 86.1-37.5 9.2-15.7 13.9-49.9 13.9-102.7v-573H285.8c-62.8 0-105.7 10.2-128.8 30.5-34.2 24.9-54 69.7-59.6 134.4H64.9l-0.3-236h811l0.2 235.9zM893.2 670.4h22.5v213.7c0 10.1 0.6 16.6 1.9 19.5 1.3 2.9 3.4 5.1 6.4 6.6 3 1.5 8.8 2.2 17.5 2.2h18.1v21.2H829.3v-21.2h20.1c8.7 0 14.6-0.8 17.4-2.3 2.9-1.5 5.1-4 6.7-7.4 1.6-3.4 2.4-9.6 2.4-18.5v-170h-46.7v-21.6c25.6-3.6 46.9-11 64-22.2z"  ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0);}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn();};document.addEventListener("DOMContentLoaded",loadFn,false);}}else if(document.attachEvent){IEContentLoaded(window,fn);}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn();}};var polling=function(){try{d.documentElement.doScroll("left");}catch(e){setTimeout(polling,50);return}init();};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init();}};}};var before=function(el,target){target.parentNode.insertBefore(el,target);};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild);}else{target.appendChild(el);}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body);}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");}catch(e){console&&console.log(e);}}ready(appendSvg);})(window);

//

var script$2 = {
  name: 'VueInlineEditor',
  props: {
    value: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: null
    },
    pastePlain: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      currentValue: this.value,
      editContent: null,
      toolbar: null
    };
  },
  mounted: function mounted() {
    this.editContent = this.$refs.editContent;
    this.editContent.innerHTML = this.value;

    this.initToolbar();

    document.addEventListener('click', this.bindClickEvent);
  },
  beforeDestroy: function beforeDestroy() {
    this.toolbar.$el.remove();
  },
  destroyed: function destroyed() {
    document.removeEventListener('click', this.bindClickEvent);
  },
  methods: {
    setCurrentVal: function setCurrentVal(value) {
      this.$emit('input', value);
      this.$emit('change', value);
      this.currentValue = value;
    },
    execCommand: function execCommand(ref) {
      var name = ref.name;
      var value = ref.value;

      if (this[name]) {
        this[name](name, value);
      } else {
        var sel = this.getSelection();
        var range = this.getRange();
        if (!sel || !range) { return; }
        if (document.queryCommandSupported('styleWithCss')) {
          document.execCommand('styleWithCss', false, true);
        }
        document.execCommand(name, false, value);
      }
      this.updateButtonState();

      var contentText = this.editContent.innerHTML;
      this.setCurrentVal(contentText);
    },
    getSelection: function getSelection() {
      if (document.getSelection) {
        return document.getSelection();
      }
    },
    getRange: function getRange() {
      var sel = this.getSelection();
      var range;
      if (sel && sel.rangeCount !== 0) {
        range = sel.getRangeAt(0);
      }
      return range;
    },
    fontSize: function fontSize(name, value) {
      var this$1 = this;

      var selection = this.getSelection();
      var range = this.getRange();
      if (!selection || !range || range.collapsed) { return; }

      var childNodes = range.cloneContents().childNodes;
      if (childNodes.length === 1 && childNodes[0].nodeType === 1 && childNodes[0].tagName.toLowerCase() === 'span') {
        var span = range.extractContents().childNodes[0];
        span.style.fontSize = value;
        range.insertNode(span);
        range.selectNode(span);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        if (navigator.userAgent.indexOf('Chrome') !== -1 && navigator.userAgent.indexOf('Edge') === -1) {
          if (document.queryCommandSupported('styleWithCss')) {
            document.execCommand('styleWithCss', false, true);
          }
          document.execCommand('fontSize', false, 7);
          var container = range.commonAncestorContainer;
          container.nodeType === 3 && (container = container.parentNode);
          container.tagName.toLowerCase() === 'span' && (container = container.parentNode);
          Array.prototype.forEach.call(container.getElementsByTagName('span'), function (span) {
            if (span.style.fontSize.trim() === '-webkit-xxx-large' || span.style.fontSize.trim() === 'xxx-large') {
              span.style.fontSize = value;
            }
            span.normalize();
          });
        } else {
          if (document.queryCommandSupported('styleWithCss')) {
            document.execCommand('styleWithCss', false, false);
          }
          document.execCommand('fontSize', false, 7);

          var fontList = [];
          var spanList = [];
          var container$1 = range.commonAncestorContainer;
          container$1.nodeType === 3 && (container$1 = container$1.parentNode);
          container$1.tagName.toLowerCase() === 'font' && (container$1 = container$1.parentNode);
          fontList = container$1.getElementsByTagName('font');
          var loop = function ( i$1 ) {
            var font = fontList[i$1];
            var span$1 = document.createElement('span');
            Array.prototype.forEach.call(font.attributes, function (attr) {
              // eslint-disable-next-line no-unused-expressions
              attr.nodeName === 'size' ? span$1.style.fontSize = value : span$1.setAttribute(attr.nodeName, attr.nodeValue);
            });
            span$1.innerHTML = font.innerHTML;
            span$1.querySelectorAll('span').length !== 0 && this$1.formatContent(span$1, 'span', 'fontSize');
            span$1.normalize();
            font.parentNode.replaceChild(span$1, font);
            spanList.push(span$1);
            // eslint-disable-next-line no-plusplus
            i$1--;

            i = i$1;
          };

          for (var i = 0; i < fontList.length; i++) loop( i );
          range.setStartBefore(spanList[0]);
          range.setEndAfter(spanList[spanList.length - 1]);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    },
    showToolbar: function showToolbar() {
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      var toolbar = this.toolbar.$el;
      var limit = 2;
      var limitR = (window.innerWidth - toolbar.clientWidth) - 2;
      var boundary = range.getBoundingClientRect();

      var left = (((boundary.right - boundary.left) / 2) + boundary.left) - (toolbar.clientWidth / 2);
      var top = boundary.top - (toolbar.clientHeight + 8) + window.pageYOffset;

      left = left < limit ? limit : left > limitR ? limitR : left;

      toolbar.style.top = top + 'px';
      toolbar.style.left = left + 'px';
    },
    hideToolbar: function hideToolbar() {
      this.toolbar.$el.style.top = '-9999px';
    },
    handleKeyup: function handleKeyup(event) {
      var value = event.target.innerHTML;
      this.toolbar.$el.style.top = '-9999px';
      this.setCurrentVal(value);
    },
    handleMouseup: function handleMouseup() {
      var this$1 = this;

      setTimeout(function () {
        var selection = window.getSelection();
        if (selection.isCollapsed) {
          this$1.hideToolbar();
        } else {
          this$1.updateButtonState();
          this$1.showToolbar();
        }
      }, 1);
    },
    handlePaste: function handlePaste(event) {
      if (this.pastePlain) {
        event.preventDefault();
        var text = (event.clipboardData || window.clipboardData).getData('text/plain');
        if (document.queryCommandSupported('insertText')) {
          document.execCommand('insertText', false, text);
        } else {
          document.execCommand('paste', false, text);
        }
      }
    },
    rgbToHex: function rgbToHex(rgb) {
      var regExp = /\((.+)\)/;
      var result = rgb.match(regExp);
      if (result) {
        result = result[1].split(',');
        var r = parseInt(result[0].trim());
        var g = parseInt(result[1].trim());
        var b = parseInt(result[2].trim());
        var hex = ((r << 16) | (g << 8) | b).toString(16);
        return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
      }
      return '';
    },
    updateButtonState: function updateButtonState() {
      var buttons = this.toolbar.buttons;
      var selects = this.toolbar.selects;
      var colorPickers = this.toolbar.colorPickers;
      var d = document;
      var state = {
        'is_bold': d.queryCommandValue('bold'),
        'is_italic': d.queryCommandValue('italic'),
        'is_underline': d.queryCommandValue('underline'),
        'is_strikeThrough': d.queryCommandValue('strikeThrough'),
        'is_superscript': d.queryCommandValue('superscript'),
        'is_subscript': d.queryCommandValue('subscript'),
        'is_justifyLeft': d.queryCommandValue('justifyLeft'),
        'is_justifyCenter': d.queryCommandValue('justifyCenter'),
        'is_justifyRight': d.queryCommandValue('justifyRight')
      };

      // eslint-disable-next-line no-restricted-syntax
      for (var button in buttons) {
        if (buttons[button].hasOwnProperty('active')) {
          buttons[button].active = state['is_' + button] === 'true';
        }
      }

      var fontName = d.queryCommandValue('fontName');
      selects.fontName.value = fontName.split(',')[0] || '';
      selects.fontSize.value = this.updateFontSize() || '';

      var foreColor = d.queryCommandValue('foreColor');
      var backColor = d.queryCommandValue('backColor');
      colorPickers.foreColor.value = this.rgbToHex(foreColor) || '';
      colorPickers.backColor.value = this.rgbToHex(backColor) || '';
    },
    getFontSize: function getFontSize(element) {
      if (element.nodeType === 3) {
        element = element.parentNode;
      }
      var value = element.style['fontSize'] || this.getWindow(element).getComputedStyle(element, '').getPropertyValue('font-size');

      return value;
    },
    getWindow: function getWindow(node) {
      var doc = node.ownerDocument || node;
      return doc.defaultView || doc.parentWindow;
    },
    updateFontSize: function updateFontSize() {
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      var element = range.startContainer;
      var styleVal = this.getFontSize(element);
      var tmp = /^([\d]+)(\w+)$/.exec(styleVal);

      if (tmp) {
        return Math.floor(tmp[1]) + tmp[2];
      }
      return styleVal;
    },
    bindClickEvent: function bindClickEvent(event) {
      var isClickToolbar = event.path.includes(this.toolbar.$el);
      var isClickContent = event.path.includes(this.editContent);
      if (!isClickToolbar && !isClickContent) {
        this.hideToolbar();
      }
    },
    initToolbar: function initToolbar() {
      var Instant = new Vue(__vue_component__$1);
      Instant.$on('execCommand', this.execCommand);
      Instant.$data.options = this.options;

      var toolbar = Instant.$mount();
      document.body.appendChild(toolbar.$el);
      this.toolbar = toolbar;
    }
  }
};

/* script */
var __vue_script__$2 = script$2;
/* template */
var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"vueInlineEditor",staticClass:"vue-inline-editor"},[_c('div',{ref:"editContent",staticClass:"vie-editor-content",attrs:{"contenteditable":"true"},on:{"keyup":_vm.handleKeyup,"paste":function($event){$event.stopPropagation();return _vm.handlePaste($event)},"mouseup":_vm.handleMouseup}})])};
var __vue_staticRenderFns__$2 = [];

  /* style */
  var __vue_inject_styles__$2 = undefined;
  /* scoped */
  var __vue_scope_id__$2 = undefined;
  /* module identifier */
  var __vue_module_identifier__$2 = undefined;
  /* functional template */
  var __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$2 = normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    undefined,
    undefined,
    undefined
  );

__vue_component__$2.install = function (Vue) {
  Vue.component(__vue_component__$2.name, __vue_component__$2);
};

module.exports = __vue_component__$2;
