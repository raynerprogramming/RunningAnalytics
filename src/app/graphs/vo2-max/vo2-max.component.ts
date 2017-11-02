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
  private graphGoals: RunGoal[][];
  private legendData: RunGoal[];
  private colors: string[];
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
      this.goals.every(x => x.active = true);
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
      var totalLines = this.goals.length + 1;
      this.colors = this.getColorsArray(totalLines);
      this.buildChartData();
      this.buildChart();
    });
    this.storage.getRunLogs((err, doc) => {
      this.logs = doc;
      this.logs.every(x => x.active = true);
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
      this.buildChartData();
      this.buildChart();
    });


  }
  private toggleActive(goal: RunGoal) {
    this.goals.find(x => x.distance == goal.distance && x.date == goal.date && x.duration == goal.duration).active = !goal.active;
    this.legendData.find(x => x.distance == goal.distance && x.date == goal.date && x.duration == goal.duration).active = !goal.active;
    var svg = this.host.select('svg');
    svg.remove();
    this.buildChartData();
    this.buildChart();
  }

  private buildChartData() {
    if (!this.goals || !this.logs) {
      return;
    }
    this.legendData = new Array<RunGoal>();
    this.graphGoals = new Array<Array<RunGoal>>();
    this.goals.forEach((goal) => {
      var progressToGoal = new Array<RunGoal>();
      progressToGoal.push(this.logs[0]);
      progressToGoal.push(goal);
      this.graphGoals.push(progressToGoal);
    });
    //this.logs[this.logs.length - 1].tags = new Array();
    this.graphGoals.push(this.logs);

    this.graphGoals.forEach((d) => {
      this.legendData.push(d[d.length - 1]);
    })
  }

  private buildChart() {
    var totalLines = this.goals.length + 1;
    var colors = this.getColorsArray(totalLines);

    let calc = this.runCalc;
    let rgb = this.rgb;
    let getText = this.getText;
    var graphGoals = this.graphGoals;
    var activeGraphs = graphGoals.filter(x => x[x.length - 1].active);
    var legendData = this.legendData;

    var w = 1250;
    var h = 600;
    var padding = 50;

    // Define axis ranges & scales        
    var yExtents = D3.extent(D3.merge(activeGraphs), function (d: RunGoal) { return calc.VO2Max(d) });
    var xExtents = D3.extent(D3.merge(activeGraphs), function (d: RunGoal) { return new Date(d.date); });

    var xScale = D3.scaleTime()
      .domain([xExtents[0], xExtents[1]])
      .range([padding, w - padding * 2 - 300]);

    var yScale = D3.scaleLinear()
      .domain([0, yExtents[1]])
      .range([h - padding, padding]);

    // Create SVG element
    var svg = this.host
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    var graphSvg = svg
      .append("svg")
      .attr("width", w - 300)
      .attr("height", h);
    // Define lines
    var line = D3.line<RunGoal>()
      .curve(D3.curveLinear)
      .x(function (d) { return xScale(new Date(d.date)); })
      .y(function (d) { return yScale(calc.VO2Max(d)); })

    var pathContainers = graphSvg.selectAll('g')
      .data(activeGraphs);

    pathContainers.enter().append('g')
      .append('path')
      .attr('d', line)
      .attr('class', 'line')
      .attr('stroke', function (d) { return rgb(colors[graphGoals.indexOf(d)]) });

    // add circles
    graphSvg.selectAll('g')
      .data(activeGraphs)
      .selectAll('circle')
      .data(function (d) { return d; })
      .enter().append('circle')
      .attr('class', 'circle')
      .attr('stroke', function (d) { return rgb(colors[0]) })
      .attr('cx', function (d) { return xScale(new Date(d.date)); })
      .attr('cy', function (d) { return yScale(calc.VO2Max(d)); })
      .attr('r', 5);

    //Define X axis
    var xAxis = D3.axisBottom(xScale)
      .ticks(5);

    //Define Y axis
    var yAxis = D3.axisLeft(yScale)
      .ticks(5);

    //Add X axis
    graphSvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

    //Add Y axis
    graphSvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    // Add title	  
    graphSvg.append("svg:text")
      .attr("class", "title")
      .attr("x", 20)
      .attr("y", 20)
      .text("Fruit Sold Per Hour");
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
  rgb(rgb) {
    return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
  }
  getText(d: any, i) {
    return d.tags ? "RunLog" : "Goal: " + moment(d.date).format("MM-DD-YYYY") + " distance: " + d.distance;
  }

}