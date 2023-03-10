// https://editor.p5js.org/jht1493/sketches/5LgILr8RF
// Firebase-createImg-board
// Display images from Firebase storage as a bill board

let storeKey = 'mo-gallery-web';
let nitems = 0;
let updateCount = 0;
let rdata;
let doScroll = false;

function setup() {
  noCanvas();
  // console.log('app', fb_.app);

  // Setup listner for changes to firebase db
  let galleryRef = fb_.ref(fb_.database, storeKey);
  fb_.onValue(galleryRef, (snapshot) => {
    const data = snapshot.val();
    console.log('galleryRef data', data);
    received_gallery(data);
  });

  let shuffleBtn = createButton('Shuffle').mousePressed(() => {
    //console.log('Shuffle');
    received_gallery(rdata, { doShuffle: 1 });
  });
  shuffleBtn.style('font-size:42px');

  let fullScreenBtn = createButton('Full Screen').mousePressed(() => {
    ui_toggleFullScreen();
  });
  fullScreenBtn.style('font-size:42px');

  let toggleScrollButn = createButton('Scroll').mousePressed(() => {
    doScroll = !doScroll;
  });
  toggleScrollButn.style('font-size:42px');

  ui_update();
}

function ui_update() {
  ui_span('date', ' ' + formatDate());
  ui_span('updateCount', ' updateCount:' + updateCount);
  ui_span('nitems', ' nitems:' + nitems);
}

function formatDate() {
  // return '';
  return new Date().toISOString();
}
function received_gallery(data, opts) {
  let div = ui_div_empty('igallery');
  if (!data) {
    return;
  }
  rdata = data;
  updateCount += 1;

  // for (key in data) {
  //   console.log('key', key);
  //   let val = data[key];

  // Display in reverse order to see new additions first
  let arr = Object.values(data).reverse();
  if (opts && opts.doShuffle) {
    arr = shuffle(arr);
  }
  nitems = arr.length;

  for (val of arr) {
    console.log('val', val);
    // let img = createImg( 'https://p5js.org/assets/img/asterisk-01.png', 'the p5 magenta asterisk' );
    // select full resolution media if available
    //
    let path = val.mediaPathFullRez ?? val.mediaPath;
    let img = createImg(path, val.authorEmail);
    div.child(img);

    ui_update();
  }
}

function ui_div_empty(id) {
  let div = select('#' + id);
  // console.log('ui_device_selection div', div);
  if (!div) {
    div = createDiv().id(id);
  } else {
    let children = div.child();
    for (let index = children.length - 1; index >= 0; index--) {
      let elm = children[index];
      elm.remove();
    }
  }
  return div;
}

function ui_span(id, html) {
  let span = select('#' + id);
  if (!span) {
    span = createSpan().id(id);
  }
  span.html(html);
}

function ui_toggleFullScreen() {
  if (!document.documentElement.requestFullscreen) {
    console.log('NO document.documentElement.requestFullscreen');
    return;
  }
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
