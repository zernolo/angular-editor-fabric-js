import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'angular-editor-fabric-js',
  templateUrl: './angular-editor-fabric-js.component.html',
  styleUrls: ['./angular-editor-fabric-js.component.scss'],
})
export class FabricjsEditorComponent implements AfterViewInit {
  @ViewChild('htmlCanvas') htmlCanvas?: ElementRef;

  private canvas?: fabric.Canvas;
  public props: any = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: ''
  };

  public textString?: string;
  public url: string | ArrayBuffer = '';
  public size: any = {
    width: 500,
    height: 800
  };

  public json: any;
  public textEditor = false;
  public figureEditor = false;

  public selected: fabric.Object | undefined

  @Output()
  public selectionEvent : EventEmitter<fabric.Object | undefined> = new EventEmitter()

  constructor() { }

  ngAfterViewInit(): void {

    this.canvas = new fabric.Canvas(this.htmlCanvas?.nativeElement, {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue',
      isDrawingMode: false
    });

    this.canvas.on('object:moving', (e: fabric.IEvent) => { })

    this.canvas.on('object:modified', (e: fabric.IEvent) => { })

    this.canvas.on('object:selected', (e: fabric.IEvent) => {
      if (e.selected)
        this.handleObjectSelectionEvent(e.selected);
    })

    this.canvas.on('object:added', (e: fabric.IEvent) => {
      console.log("object:added", e);
      if (e.target)
        this.handleObjectSelectionEvent([e.target]);
    })

    this.canvas.on('selection:created', (e: fabric.IEvent) => {
      console.log("selection:created", e);
      if (e.target)
        this.handleObjectSelectionEvent([e.target]);
    })

    this.canvas.on('selection:updated', (e: fabric.IEvent) => {
      console.log("selection:updated", e);
      if (e.selected)
        this.handleObjectSelectionEvent(e.selected);
    })

    this.canvas.on('selection:cleared', (e: fabric.IEvent) => {
      this.selected = undefined;
      this.resetPanels();
      this.selectionEvent.emit(this.selected)
    });

    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);

    // get references to the html canvas element & its context
    this.canvas.on('mouse:down', (e: fabric.IEvent) => {
      const canvasElement: any = document.getElementById('canvas');
    });

  }


  private handleObjectSelectionEvent(e: fabric.Object[]) {
    if (Array.isArray(e) && e.length > 0) {
      this.selected = e[0];
      this.canvas?.setActiveObject(this.selected)
    } else {
      this.selected = undefined
    }
    this.resetPanels();
    const selectedObject = this.selected;
    if (selectedObject) {
      selectedObject.hasRotatingPoint = true;
      selectedObject.transparentCorners = false;
      selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';
    }
    if (selectedObject?.type !== 'group' && selectedObject) {
      //this.getId();
      //this.getOpacity();
      switch (selectedObject.type) {
        case 'rect':
        case 'circle':
        case 'triangle':
          this.figureEditor = true;
          this.getFill();
          break;
        case 'i-text':
          this.textEditor = true;
          this.getLineHeight();
          this.getCharSpacing();
          this.getBold();
          this.getFill();
          this.getTextDecoration();
          this.getTextAlign();
          this.getFontFamily();
          break;
        case 'image':
          break;
      }
    }
    this.selectionEvent.emit(this.selected)
  }

  /*------------------------Block elements------------------------*/

  // Block "Size"

  changeSize() {
    this.canvas?.setWidth(this.size.width);
    this.canvas?.setHeight(this.size.height);
  }

  // Block "Add text"

  addText() {
    if (this.canvas && this.textString) {
      const text = new fabric.IText(this.textString, {
        left: 10,
        top: 10,
        fontFamily: 'helvetica',
        angle: 0,
        fill: '#000000',
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
        hasRotatingPoint: true
      });

      this.extend(text, this.randomId());
      this.canvas.add(text);
      this.selectItemAfterAdded(text);
      this.textString = '';
    }
  }

  // Block "Add images"

  getImgPolaroid(event: any) {
    const el = event.target;
    fabric.loadSVGFromURL(el.src, (objects: any, options: any) => {
      const image = fabric.util.groupSVGElements(objects, options);
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornerSize: 10,
        hasRotatingPoint: true,
      });
      this.extend(image, this.randomId());
      this.canvas?.add(image);
      this.selectItemAfterAdded(image);
    });
  }

  // Block "Upload Image"

  addImageOnCanvas(url: string) {
    if (url) {
      fabric.Image.fromURL(url, (image: any) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornerSize: 10,
          hasRotatingPoint: true
        });
        image.scaleToWidth(200);
        image.scaleToHeight(200);
        this.extend(image, this.randomId());
        this.canvas?.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        if (readerEvent.target?.result)
          this.url = readerEvent.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url: string) {
    this.url = '';
  }

  // Block "Add figure"

  addFigure(figure: string) {
    let add: any;
    switch (figure) {
      case 'rectangle':
        add = new fabric.Rect({
          width: 200, height: 100, left: 10, top: 10, angle: 0,
          fill: '#3f51b5'
        });
        break;
      case 'square':
        add = new fabric.Rect({
          width: 100, height: 100, left: 10, top: 10, angle: 0,
          fill: '#4caf50'
        });
        break;
      case 'triangle':
        add = new fabric.Triangle({
          width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
        });
        break;
      case 'circle':
        add = new fabric.Circle({
          radius: 50, left: 10, top: 10, fill: '#ff5722'
        });
        break;
    }
    this.extend(add, this.randomId());
    this.canvas?.add(add);
    this.selectItemAfterAdded(add);
  }

  changeFigureColor(color: any) {
    this.canvas?.getActiveObject()?.set("fill", color);
    this.canvas?.renderAll();
  };

  /*Canvas*/

  cleanSelect() {
    this.canvas?.discardActiveObject().renderAll();
  }

  selectItemAfterAdded(obj: any) {
    this.canvas?.discardActiveObject().renderAll();
    this.canvas?.setActiveObject(obj);
  }

  setCanvasFill() {
    if (this.canvas && !this.props.canvasImage) {
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }

  extend(obj: any, id: any) {
    obj.toObject = ((toObject) => {
      const questo = this;
      return function () {
        return fabric.util.object.extend(toObject.call(questo), {
          id
        });
      };
    })(obj.toObject);
  }

  setCanvasImage() {
    const self = this;
    if (this.canvas && this.props.canvasImage) {
      this.canvas.setBackgroundColor(new fabric.Pattern({ source: this.props.canvasImage, repeat: 'repeat' }), () => {
        self.props.canvasFill = '';
        self.canvas?.renderAll();
      });
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  getActiveStyle(styleName: any, object: any) {
    object = object || this.canvas?.getActiveObject();
    if (!object) { return ''; }

    if (object.getSelectionStyles && object.isEditing) {
      return (object.getSelectionStyles()[styleName] || '');
    } else {
      return (object[styleName] || '');
    }
  }

  setActiveStyle(styleName: any, value: string | number, object: fabric.IText | null) {
    object = object || this.canvas?.getActiveObject() as fabric.IText;
    if (!object) { return; }

    if (object.setSelectionStyles && object.isEditing) {
      const style: any = {};
      style[styleName] = value;

      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.setSelectionStyles({ underline: true });
        } else {
          object.setSelectionStyles({ underline: false });
        }

        if (value.includes('overline')) {
          object.setSelectionStyles({ overline: true });
        } else {
          object.setSelectionStyles({ overline: false });
        }

        if (value.includes('line-through')) {
          object.setSelectionStyles({ linethrough: true });
        } else {
          object.setSelectionStyles({ linethrough: false });
        }
      }

      object.setSelectionStyles(style);
      object.setCoords();

    } else {
      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.set('underline', true);
        } else {
          object.set('underline', false);
        }

        if (value.includes('overline')) {
          object.set('overline', true);
        } else {
          object.set('overline', false);
        }

        if (value.includes('line-through')) {
          object.set('linethrough', true);
        } else {
          object.set('linethrough', false);
        }
      }

      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas?.renderAll();
  }


  getActiveProp(name: string) {
    const object: any = this.canvas?.getActiveObject();
    if (!object) { return ''; }

    return object[name] || '';
  }

  setActiveProp(name: any, value: any) {
    const object = this.canvas?.getActiveObject();
    if (!object) { return; }
    object.set(name, value).setCoords();
    this.canvas?.renderAll();
  }

  clone() {
    const activeObject = this.canvas?.getActiveObject();
    const activeGroup = this.canvas?.getActiveObjects();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
      }
      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.canvas?.add(clone);
        this.selectItemAfterAdded(clone);
      }
    }
  }

  getId() {
    this.props.id = this.canvas?.getActiveObject()?.toObject().id;
  }

  setId() {
    if (this.canvas) {
      const val = this.props.id;
      const complete = this.canvas.getActiveObject()?.toObject();
      console.log(complete);
      const newLocal = this.canvas.getActiveObject();
      if (newLocal)
        newLocal.toObject = () => {
          complete.id = val;
          return complete;
        };
    }
  }

  getOpacity() {
    this.props.opacity = Number(this.getActiveStyle('opacity', null) * 100);
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.props.opacity, 10) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.props.fontSize, 10), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle;
    if (this.props.fontStyle) {
      this.setActiveStyle('fontStyle', 'italic', null);
    } else {
      this.setActiveStyle('fontStyle', 'normal', null);
    }
  }

  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value: any) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, 'g'), '');
    } else {
      iclass += ` ${value}`;
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value: any) {
    return this.props.TextDecoration.includes(value);
  }

  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value: any) {
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  /*System*/


  removeSelected() {
    if (this.canvas) {
      const activeObject: any = this.canvas.getActiveObject();
      const activeGroup: any = this.canvas.getActiveObjects();

      if (activeGroup) {
        this.canvas.discardActiveObject();
        const self = this;
        activeGroup.forEach((object: any) => {
          self.canvas?.remove(object);
        });
      } else if (activeObject) {
        this.canvas.remove(activeObject);
      }
    }
  }

  bringToFront() {
    const activeObject = this.canvas?.getActiveObject();
    const activeGroup = this.canvas?.getActiveObjects();

    if (activeObject) {
      activeObject.bringToFront();
      activeObject.opacity = 1;
    } else if (activeGroup) {
      this.canvas?.discardActiveObject();
      activeGroup.forEach((object: any) => {
        object.bringToFront();
      });
    }
  }

  sendToBack() {
    const activeObject = this.canvas?.getActiveObject();
    const activeGroup = this.canvas?.getActiveObjects();

    console.log("sendToBack", {activeGroup, activeObject})
    if (activeObject) {
      this.canvas?.sendToBack(activeObject);
      activeObject.sendToBack();
      activeObject.opacity = 1;
    } else if (activeGroup) {
      this.canvas?.discardActiveObject();
      activeGroup.forEach((object: any) => {
        object.sendToBack();
      });
    }
  }

  confirmClear() {
    if (confirm('Are you sure?')) {
      this.canvas?.clear();
    }
  }

  rasterize() {
    const image = new Image();
    const src = this.canvas?.toDataURL({ format: 'png' });
    if (src) {
      image.src = src
      const w: Window | null = window.open('');
      if (w) {
        w.document.write(image.outerHTML);
        this.downLoadImage();
      }
    }
  }

  downLoadImage() {
    const c = this.canvas?.toDataURL({ format: 'png' });
    if (c) {
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);
      downloadLink.href = c;
      downloadLink.target = '_self';
      downloadLink.download = Date.now() + '.png';
      downloadLink.click();
    }
  }

  rasterizeSVG() {
    const w = window.open('');
    if (w && this.canvas) {
      w.document.write(this.canvas.toSVG());
      this.downLoadSVG();
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(this.canvas.toSVG());
    }
    return ""
  }

  downLoadSVG() {
    if (this.canvas) {
      const c = 'data:image/svg+xml;utf8,' + encodeURIComponent(this.canvas.toSVG());
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);
      downloadLink.href = c;
      downloadLink.target = '_self';
      downloadLink.download = Date.now() + '.svg';
      downloadLink.click();
    }
  }

  saveCanvasToJSON() {
    const json = JSON.stringify(this.canvas);
    localStorage.setItem('Kanvas', json);
    console.log('json');
    console.log(json);

  }

  loadCanvasFromJSON() {
    const CANVAS = localStorage.getItem('Kanvas');
    console.log('CANVAS');
    console.log(CANVAS);

    // and load everything from the same json
    this.canvas?.loadFromJSON(CANVAS, () => {
      console.log('CANVAS untar');
      console.log(CANVAS);

      // making sure to render canvas at the end
      this.canvas?.renderAll();

      // and checking if object's "name" is preserved
      console.log('this.canvas.item(0).name');
      console.log(this.canvas);
    });

  }

  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas, null, 2);
  }

  resetPanels() {
    this.textEditor = false;
    this.figureEditor = false;
  }

  toggleDrawingMode() {
    if (this.canvas) {
      this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
    }
  }

}
