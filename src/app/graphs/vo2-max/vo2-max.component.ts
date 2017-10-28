import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { StorageService } from '../../storage.service';
import { CalculationsService } from '../../calculations.service';
import { RunLog } from "../../run-log"
import { RunGoal } from "../../run-goal"
import * as D3 from "d3";
import * as moment from "moment";

@Component({
  selector: 'app-vo2-max',
  templateUrl: './vo2-max.component.html',
  styleUrls: ['./vo2-max.component.css']
})

export class VO2MaxComponent implements AfterViewInit {

  constructor(private storage: StorageService, private runCalc: CalculationsService) {

    var s: CalculationsService = new CalculationsService;
  }

  @ViewChild('container') element: ElementRef;

  private host;
  private svg;
  private margin;
  private width;
  private height;
  private xScale;
  private yScale;
  private xAxis;
  private yAxis;
  private goals: RunGoal[];
  private logs: RunLog[];
  private combined: RunGoal[] = new Array<RunGoal>();
  private htmlElement: HTMLElement;
  private CSS_COLOR_NAMES = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);
    this.setup();
  }

  ngOnChanges(): void {
    this.setup();
  }

  onCurveChange(curve: string) {
    this.setup();
  }

  private setup(): void {
    this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.xScale = D3.scaleTime().range([0, this.width]);
    this.yScale = D3.scaleLinear().range([this.height, 0]);
    this.storage.getRunGoals((err, doc) => {
      this.goals = doc;
      this.goals.sort((a: RunGoal, b: RunGoal) => {
        var momentA = moment(a.date);
        var momentB = moment(b.date);
        if (momentA < momentB) {
          return -1;
        }
        if (momentA > momentB) {
          return 1;
        }
        return 0;
      })
      this.buildChart();
    });
    this.storage.getRunLogs((err, doc) => {
      this.logs = doc;
      this.logs.sort((a: RunLog, b: RunLog) => {
        var momentA = moment(a.date);
        var momentB = moment(b.date);
        if (momentA < momentB) {
          return -1;
        }
        if (momentA > momentB) {
          return 1;
        }
        return 0;
      })
      this.buildChart();
    });

  }

  private buildChart() {
    if (!this.goals || !this.logs) {
      return;
    }

    this.combined = this.combined.concat(this.goals);
    var totalLines = this.goals.length + 1;
    var colors = this.getColorsArray(totalLines);
    this.combined = this.combined.concat(this.logs);
    var lineCount = 0;
    var firstLog = this.logs[0];



    this.xAxis = D3.axisBottom(this.xScale);
    this.yAxis = D3.axisLeft(this.yScale);

    this.host.html('');

    let self = this;
    let calc = this.runCalc;

    this.svg = this.host.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    self.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + self.height + ')')
      .call(self.xAxis);

    self.svg.append('g')
      .attr('class', 'y axis')
      .call(self.yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Price ($)');

    var line = D3.line()
      .curve(D3.curveLinear)
      .x(function (d: any) { return self.xScale(new Date(d.date)); })
      .y(function (d: any) { return self.yScale(calc.VO2Max(d)); });

    self.xScale.domain(D3.extent(this.combined, function (d: RunGoal) { return new Date(d.date); }));
    self.yScale.domain(D3.extent(this.combined, function (d: RunGoal) { return calc.VO2Max(d) }));

    this.goals.forEach((goal) => {
      var progressToGoal = new Array<RunGoal>();
      progressToGoal.push(firstLog);
      progressToGoal.push(goal);
      var goalLine = D3.line()
        .curve(D3.curveLinear)
        .x(function (d: any) { return self.xScale(new Date(d.date)); })
        .y(function (d: any) { return self.yScale(calc.VO2Max(d)); });

      self.svg.append('path')
        .datum(progressToGoal)
        .attr('class', 'line')
        .attr('d', goalLine)
        .attr('stroke', this.rgb(colors[lineCount][0],colors[lineCount][1],colors[lineCount][2]));
      lineCount++;
    })

    self.svg.append('path')
      .datum(this.logs)
      .attr('class', 'line')
      .attr('d', line)
      .attr('stroke', this.rgb(colors[lineCount][0],colors[lineCount][1],colors[lineCount][2]));
    lineCount++;
  }

  graph(): void {

  };

  private type(d: any) {
    const formatDate = D3.timeParse('%d-%b-%y');

    d.date = formatDate(d.date);
    d.close = +d.close;

    return d;
  }
  getColorsArray(total) {
    var i = 360 / (total - 1); // distribute the colors evenly on the hue range
    var r = []; // hold the generated colors
    for (var x = 0; x < total; x++) {
      r.push(this.hsvToRgb(i * x, 100, 100)); // you can also alternate the saturation and value for even more contrast between the colors
    }
    return r;
  }
  /**
 * HSV to RGB color conversion
 *
 * H runs from 0 to 360 degrees
 * S and V run from 0 to 100
 * 
 * Ported from the excellent java algorithm by Eugene Vishnevsky at:
 * http://www.cs.rit.edu/~ncs/color/t_convert.html
 */
  hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;

    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;

    if (s == 0) {
      // Achromatic (grey)
      r = g = b = v;
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;

      case 1:
        r = q;
        g = v;
        b = p;
        break;

      case 2:
        r = p;
        g = v;
        b = t;
        break;

      case 3:
        r = p;
        g = q;
        b = v;
        break;

      case 4:
        r = t;
        g = p;
        b = v;
        break;

      default: // case 5:
        r = v;
        g = p;
        b = q;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
  }

}