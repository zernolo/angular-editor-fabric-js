import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColorPickerModule } from 'ngx-color-picker';
import { FabricjsEditorComponent } from '../angular-editor-fabric-js/angular-editor-fabric-js.component';

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FabricjsEditorComponent, ColorPickerModule, MatButtonModule, MatIconModule],
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.scss'
})
export class ImageEditorComponent {

  @ViewChild('canvas', { static: false }) canvas?: FabricjsEditorComponent;
  
  selectedObject: fabric.Object|undefined;

  onSelectionEvent(event: fabric.Object|undefined) {
    this.selectedObject = event
  }
 

  public rasterize() {
    this.canvas?.rasterize();
  }

  public rasterizeSVG() {
    this.canvas?.rasterizeSVG();
  }

  public saveCanvasToJSON() {
    this.canvas?.saveCanvasToJSON();
  }

  public loadCanvasFromJSON() {
    this.canvas?.loadCanvasFromJSON();
  }

  public confirmClear() {
    this.canvas?.confirmClear();
  }

  public changeSize() {
    this.canvas?.changeSize();
  }

  public addText() {
    this.canvas?.addText();
  }

  public getImgPolaroid(event:any) {
    this.canvas?.getImgPolaroid(event);
  }

  public addImageOnCanvas(url:any) {
    this.canvas?.addImageOnCanvas(url);
  }

  public readUrl(event:any) {
    this.canvas?.readUrl(event);
  }

  public removeWhite(url:any) {
    this.canvas?.removeWhite(url);
  }

  public addFigure(figure:any) {
    this.canvas?.addFigure(figure);
  }

  public removeSelected() {
    this.canvas?.removeSelected();
  }

  public sendToBack() {
    console.log("sendToBack", {canvas: this.canvas})
    this.canvas?.sendToBack();
  }

  public bringToFront() {
    this.canvas?.bringToFront();
  }

  public clone() {
    this.canvas?.clone();
  }

  public cleanSelect() {
    this.canvas?.cleanSelect();
  }

  public setCanvasFill() {
    this.canvas?.setCanvasFill();
  }

  public setCanvasImage() {
    this.canvas?.setCanvasImage();
  }

  public setId() {
    this.canvas?.setId();
  }

  public setOpacity() {
    this.canvas?.setOpacity();
  }

  public setFill() {
    this.canvas?.setFill();
  }

  public setFontFamily() {
    this.canvas?.setFontFamily();
  }

  public setTextAlign(value:any) {
    this.canvas?.setTextAlign(value);
  }

  public setBold() {
    this.canvas?.setBold();
  }

  public setFontStyle() {
    this.canvas?.setFontStyle();
  }

  public hasTextDecoration(value:any) {
    this.canvas?.hasTextDecoration(value);
  }

  public setTextDecoration(value:any) {
    this.canvas?.setTextDecoration(value);
  }

  public setFontSize() {
    this.canvas?.setFontSize();
  }

  public setLineHeight() {
    this.canvas?.setLineHeight();
  }

  public setCharSpacing() {
    this.canvas?.setCharSpacing();
  }

  public rasterizeJSON() {
    this.canvas?.rasterizeJSON();
  }

  public drawMode() {
    this.canvas?.toggleDrawingMode();
  }

  public changeFigureColor(color:any){
    this.canvas?.changeFigureColor(color);
  }

  onObjectColorChange(e:any){
    console.log(e)
    this.changeFigureColor(e.target.value)
  }

}
