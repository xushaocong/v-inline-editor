<template>
<div class="color-picker" v-clickoutside="closeColorPanel">
    <!-- 颜色显示小方块 -->
    <button class="color-picker__trigger" @click="toggleStatus">
        <slot name="icon"></slot>
    </button>
    <!-- 用以激活HTML5颜色面板 -->
    <input class="color-picker__input"
           type="color"
           ref="colorPickerInput"
           v-model="inputColor"
           @change="updateValue(inputColor)">
    <!-- 颜色色盘 -->
    <div class="color-picker__panel" :class="{ open: openStatus }" :style="`${position}: 0`">
        <div class="color-picker__panel-header">
            <div v-if="showPanelColor === 'transparent'" class="color-transparent"></div>
            <div v-else class="color-view" :style="`background-color: ${showPanelColor}`"></div>
            <input type="text" class="color-value" v-model="showPanelColor" readonly>
        </div>
        <div class="color-picker__panel-body">
            <h3>主题颜色</h3>
            <ul class="theme-color">
                <button
                    class="button-transparent"
                    @mouseover="hoverColor = 'transparent'"
                    @mouseout="hoverColor = null"
                    @click="updateValue('transparent')">
                    <i class="iconfont icon-slash"></i>
                </button>
                <button
                    v-for="(color, index) of themeColor"
                    :key="index"
                    :style="{ backgroundColor: color }"
                    @mouseover="hoverColor = color"
                    @mouseout="hoverColor = null"
                    @click="updateValue(color)">
                </button>
            </ul>
            <h3>标准颜色</h3>
            <ul class="base-color">
            <li v-for="(item, index) of colorPanel" :key="index">
                <ul>
                    <button v-for="color of item"
                        :key="color"
                        :style="{ backgroundColor: color }"
                        @mouseover="hoverColor = color"
                        @mouseout="hoverColor = null"
                        @click="updateValue(color)">
                    </button>
                </ul>
            </li>
            </ul>
            <button class="more-color" @click="showMoreColor">更多颜色</button>
        </div>
    </div>
</div>
</template>
<script>
import Clickoutside from '../../utils/clickoutside';
export default {
    name: 'ColorPicker',
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
    directives: { Clickoutside },
    data () {
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
        showPanelColor () {
            if (this.hoverColor) {
                return this.hoverColor;
            } else {
                return this.showColor;
            }
        },
        showColor () {
            return this.value || '';
        }
    },
    methods: {
        closeColorPanel () {
            this.openStatus = false;
        },
        toggleStatus () {
            this.openStatus = !this.openStatus;
        },
        showMoreColor () {
            this.$refs.colorPickerInput.click();
        },
        updateValue (value) {
            if (value) {
                this.$emit('input', value);
                this.$emit('change', value);
                this.openStatus = false;
            }
        },
        handleDefaultColor () {
            this.updateValue(this.defaultColor);
        },

        /**
         * 格式化 hex 颜色值
         */
        parseColor (hexStr) {
            if (hexStr.length === 4) {
                hexStr = '#' + hexStr[1] + hexStr[1] + hexStr[2] + hexStr[2] + hexStr[3] + hexStr[3];
            } else {
                return hexStr;
            }
        },

        /**
         * RGB 颜色 转 HEX 颜色
         */
        rgbToHex (r, g, b) {
            let hex = ((r << 16) | (g << 8) | b).toString(16);
            return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
        },

        /**
         * HEX 转 RGB 颜色
         */
        hexToRgb (hex) {
            hex = this.parseColor(hex);
            let rgb = [];
            for (let i = 1; i < 7; i += 2) {
                rgb.push(parseInt('0x' + hex.slice(i, i + 2)));
            }
            return rgb;
        },

        /**
         * 计算渐变过渡颜色
         */
        gradient (startColor, endColor, step) {
            // 讲 hex 转换为 rgb
            let sColor = this.hexToRgb(startColor);
            let eColor = this.hexToRgb(endColor);
            // 计算R\G\B每一步的差值
            let rStep = (eColor[0] - sColor[0]) / step;
            let gStep = (eColor[1] - sColor[1]) / step;
            let bStep = (eColor[2] - sColor[2]) / step;
            let gradientColorArr = [];
            // 计算每一步的hex值
            for (let i = 0; i < step; i++) {
                gradientColorArr.push(this.rgbToHex(parseInt(rStep * i + sColor[0]), parseInt(gStep * i + sColor[1]), parseInt(bStep * i + sColor[2])));
            }
            return gradientColorArr;
        }
    }
};
</script>

<style lang="scss">
@mixin checkerboard($size, $base,$accent: rgba(0,0,0,.25)) {
    background: $base;
    background-image:
            linear-gradient(45deg,
                    $accent 25%, transparent 0,
                    transparent 75%, $accent 0),
            linear-gradient(45deg,
                    $accent 25%, transparent 0,
                    transparent 75%, $accent 0);
    background-position: 0 0, $size $size;
    background-size: 2*$size 2*$size;
}
.color-picker {
    display: inline-block;
    position: relative; 
    text-align: left;
    font-size: 14px;
    
    ul,li,ol { 
        list-style: none; 
        margin: 0; 
        padding: 0; 
    }
    
    .color-picker__input {
        position: absolute;
        visibility: hidden;
    }

    .color-picker__trigger {
        display: inline-block;
        position: relative;
        width: 28px;
        height: 32px;
        padding: 6px;
        margin: 0 2px;
        color: #8a8a8a;
        border: 1px solid transparent;
        border-radius: 4px;
        background-color: inherit;
        vertical-align: middle;
        cursor: pointer;
        outline: none;

        &:hover {
            border-color: #999;
            color: #fff;
        }

        .color-btn {
            display: inline-block;
            width: 100%; 
            height: 100%; 
            vertical-align: top;
            border-radius: 3px;
            .disabled { 
                cursor: no-drop; 
            }
        }

        .transparent {
            position: relative;
            display: inline-block;
            width: 100%; 
            height: 100%; 
            line-height: 20px;
            vertical-align: top;
            cursor: pointer;
            font-size: 20px;
            font-weight: border;
            color: #999;
            background-color: #fff;
            @include checkerboard(4px, #ccc, #fff);
        }

        .color-picker__icon {
            display: inline-block;
            position: absolute;
            bottom: 0;
            right: 0;
            width: 6px; 
            height: 6px;
            color: #888;
            background-color: #fff;
            .icon-arrow-down {
                position: absolute;
                display: inline-block;
                top: 2px;
                left: 0;
                width: 0;
                height: 0;
                border-top: 3px solid #000;
                border-right: 3px solid transparent;
                border-bottom: 3px solid transparent;
                border-left: 3px solid transparent;
            }
        }
    }

    .color-picker__panel{
        position: absolute; 
        width: 212px;   
        background: #3F3F3F;
        visibility: hidden; 
        border-radius: 2px; 
        margin-top: 2px; 
        padding: 10px 10px 5px 10px; 
        box-shadow: 0 0 5px rgba(0,0,0,.15); 
        opacity: 0; 
        transition: all .3s ease;

        h3 {
            margin: 10px 0 5px;
            font-size: 14px; 
            font-weight: normal; 
            color: #fff;
            line-height: 1; 
        }
        .more-color {
            position: relative;
            text-align: right;
            cursor: pointer;
        }
    }

    .open { 
        visibility: visible; 
        opacity: 1;
        z-index: 99999;
    }

    .color-picker__panel-header {
        overflow: hidden; 
        line-height: 29px;

        .color-view { 
            width: 100px; 
            height: 30px; 
            float: left; 
            transition: background-color .3s ease; 
        }

        .color-transparent {
            width: 100px; 
            height: 30px; 
            float: left;
            transition: background-color .3s ease;
            @include checkerboard(4px, #ccc, #fff);
        }

        .color-value { 
            display: block;
            width: 80px; 
            float: right; 
            text-align: center; 
            border: 1px solid #ddd; 
            cursor: pointer; 
        }
    }

    .theme-color {
        button { 
            display: inline-block;
            width: 15px; 
            height: 15px;
            line-height: 15px;
            margin: 0 2px;
            border: none;
            transition: all .3s ease;
            cursor: pointer;
            outline: none;
        }
        button:hover { 
            box-shadow: 0 0 5px rgba(0,0,0,.4); 
            transform: scale(1.3); 
        }
        .button-transparent {
            background-color: #fff;
            color: #999;
            vertical-align: text-top;
            margin-right: -2px;
            border: none;
            outline: none;
        }
    }
    .base-color {
        li {
            width: 15px; 
            display: inline-block; 
            margin: 0 2px;
            button { 
                display: block; 
                width: 15px; 
                height: 15px; 
                transition: all .3s ease; 
                margin: 0;
                border: none;
                outline: none;
                cursor: pointer;
            }
            button:hover { 
                box-shadow: 0 0 5px rgba(0,0,0,.4); 
                transform: scale(1.3); 
            }
        }
    }
    .more-color {
        float: right;
        color: #fff;
        background: none;
        border: none;
        outline: none;
    }
}
</style>
