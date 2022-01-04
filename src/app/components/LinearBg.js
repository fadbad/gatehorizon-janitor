import React from 'react'
import { LinearAnimated } from '../../ui'

export default ({ type = '', speed=4000 }) => {
    let colors = []
    switch(type) {
        case 'primary': 
            colors = ['#39CAA7', '#39caca', '#7839ca', '#ca395d', '#39CAA7'];
        break;

        case 'secondary': 
            colors = ['#1F1F39', '#361f39', '#1f3933', '#38391f', '#1F1F39'];
        break;

        case 'drawer':
            colors = ['#1F1F39', '#361f39', '#1f3933', '#39CAA7', '#38391f', '#1F1F39'];
        break;

        case 'home': 
            colors = ['#1F1F39', '#361f39', '#1f3933', '#39CAA7', '#38391f'];
        break;

        default: 
            colors = ['#1F1F39', '#361f39', '#1f3933', '#1F1F39'];
        break;
    }

    return <LinearAnimated colors={colors} speed={speed} />
}
