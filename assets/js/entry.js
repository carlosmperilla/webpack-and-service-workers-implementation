import '../css/app.scss';

import './slider/sliderDOM';
import './menu';

if (navigator.serviceWorker)
    navigator.serviceWorker.register('../sw.js');
