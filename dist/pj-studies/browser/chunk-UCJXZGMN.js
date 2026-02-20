import {
  AccordionModule,
  Card,
  CardModule,
  Dialog,
  DialogModule,
  DividerModule,
  Panel,
  PanelModule,
  ProgressSpinner,
  ProgressSpinnerModule,
  TTRow,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableModule,
  Tabs,
  TabsModule,
  Tag,
  TagModule,
  TreeTable,
  TreeTableModule,
  TreeTableToggler
} from "./chunk-PAN3DIBP.js";
import {
  APP_BASE_HREF,
  Button,
  ButtonModule,
  CommonModule,
  HttpClient,
  PrimeTemplate
} from "./chunk-4G4QLS67.js";
import {
  Component,
  DOCUMENT,
  Injectable,
  __spreadProps,
  __spreadValues,
  computed,
  forkJoin,
  inject,
  map,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3
} from "./chunk-HYTYLAU7.js";

// src/app/niestacjonarne/program/services/niestacjonarne-program.service.ts
var NiestacjonarneProgramService = class _NiestacjonarneProgramService {
  http = inject(HttpClient);
  document = inject(DOCUMENT);
  get baseHref() {
    const base = this.document.querySelector("base")?.getAttribute("href") ?? "/";
    return base.endsWith("/") ? base : base + "/";
  }
  url(path) {
    return `${this.baseHref}assets/niestacjonarne/${path}`;
  }
  loadAll() {
    return forkJoin({
      program: this.http.get(this.url("program.json")),
      other: this.http.get(this.url("electives-other.json")),
      spec: this.http.get(this.url("electives-specializations.json"))
    }).pipe(map(({ program, other, spec }) => this.buildViewModels(program, other, spec)));
  }
  buildViewModels(program, other, spec) {
    const groupMap = /* @__PURE__ */ new Map();
    other.groups.forEach((g) => groupMap.set(g.id, g));
    const specBySemesterGroup = /* @__PURE__ */ new Map();
    spec.specializations.forEach((s) => {
      s.items.forEach((item) => {
        const key = `SPEC_${item.semester}`;
        if (!specBySemesterGroup.has(key))
          specBySemesterGroup.set(key, []);
        const existing = specBySemesterGroup.get(key).find((x) => x.specName === s.name);
        const row = {
          name: item.name,
          type: "O",
          code: item.code,
          lecture: item.lecture,
          tutorial: item.tutorial ?? 0,
          lab: item.lab,
          form: item.form,
          ects: item.ects,
          syllabusFile: item.syllabusFile
        };
        if (existing) {
          existing.items.push(row);
        } else {
          specBySemesterGroup.get(key).push({ specName: s.name, items: [row] });
        }
      });
    });
    return program.semesters.map((sem) => {
      const processedGroups = /* @__PURE__ */ new Set();
      const nodes = [];
      sem.subjects.forEach((subject) => {
        if (subject.type === "M" || !subject.electiveGroup) {
          nodes.push({
            data: {
              name: subject.name,
              type: "Obowi\u0105zkowy",
              code: subject.code,
              lecture: subject.lecture,
              tutorial: subject.tutorial,
              lab: subject.lab,
              form: subject.form,
              ects: subject.ects,
              syllabusFile: subject.syllabusFile
            },
            leaf: true
          });
          return;
        }
        const groupId = subject.electiveGroup;
        if (processedGroups.has(groupId))
          return;
        processedGroups.add(groupId);
        const groupData = groupMap.get(groupId);
        if (groupId.startsWith("SPEC_")) {
          const specGroups = specBySemesterGroup.get(groupId) ?? [];
          const groupLabel = `Przedmioty specjalizacyjne (semestr ${sem.semester})`;
          const inGroup = sem.subjects.filter((s) => s.electiveGroup === groupId);
          nodes.push({
            data: {
              name: groupLabel,
              type: "Obieralny",
              code: "-",
              lecture: inGroup.reduce((a, s) => a + s.lecture, 0),
              tutorial: inGroup.reduce((a, s) => a + s.tutorial, 0),
              lab: inGroup.reduce((a, s) => a + s.lab, 0),
              form: "-",
              ects: inGroup.reduce((a, s) => a + s.ects, 0),
              isGroup: true,
              electiveGroup: groupId
            },
            children: specGroups.map((sg) => ({
              data: {
                name: sg.specName,
                type: "Specjalizacja",
                code: "-",
                lecture: "-",
                tutorial: "-",
                lab: "-",
                form: "-",
                ects: "-",
                isGroup: true
              },
              children: sg.items.map((item) => ({
                data: __spreadProps(__spreadValues({}, item), { type: "Obieralny specjalizacji" }),
                leaf: true
              }))
            }))
          });
        } else if (groupData && groupData.items.length > 0) {
          const inGroup = sem.subjects.filter((s) => s.electiveGroup === groupId);
          nodes.push({
            data: {
              name: groupData.label,
              type: "Obieralny",
              code: "-",
              lecture: inGroup.reduce((a, s) => a + s.lecture, 0),
              tutorial: inGroup.reduce((a, s) => a + s.tutorial, 0),
              lab: inGroup.reduce((a, s) => a + s.lab, 0),
              form: "-",
              ects: inGroup.reduce((a, s) => a + s.ects, 0),
              isGroup: true,
              electiveGroup: groupId
            },
            children: groupData.items.map((item) => ({
              data: {
                name: item.name,
                type: "Obieralny",
                code: item.code,
                lecture: item.lecture,
                tutorial: item.tutorial,
                lab: item.lab,
                form: item.form,
                ects: item.ects,
                syllabusFile: item.syllabusFile
              },
              leaf: true
            }))
          });
        } else {
          nodes.push({
            data: {
              name: subject.name,
              type: "Obieralny",
              code: subject.code,
              lecture: subject.lecture,
              tutorial: subject.tutorial,
              lab: subject.lab,
              form: subject.form,
              ects: subject.ects,
              electiveGroup: groupId,
              syllabusFile: subject.syllabusFile
            },
            leaf: true
          });
        }
      });
      return {
        semester: sem.semester,
        description: sem.description,
        nodes,
        totalEcts: sem.summary.ects,
        totalLecture: sem.summary.lecture,
        totalTutorial: sem.summary.tutorial,
        totalLab: sem.summary.lab
      };
    });
  }
  static \u0275fac = function NiestacjonarneProgramService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NiestacjonarneProgramService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NiestacjonarneProgramService, factory: _NiestacjonarneProgramService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NiestacjonarneProgramService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/niestacjonarne/program/niestacjonarne-program.component.ts
var _c0 = () => ({ width: "860px", maxWidth: "98vw" });
var _c1 = () => ({ "max-height": "80vh", "overflow-y": "auto" });
var _c2 = () => [];
var _c3 = (a0) => [a0];
var _forTrack0 = ($index, $item) => $item.semester;
var _forTrack1 = ($index, $item) => $item.forma;
function NiestacjonarneProgramComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1, "\u0141adowanie danych programu...");
    \u0275\u0275elementEnd();
  }
}
function NiestacjonarneProgramComponent_Conditional_2_For_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-tab", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sem_r1 = ctx.$implicit;
    \u0275\u0275property("value", sem_r1.semester.toString());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Semestr ", sem_r1.semester, " ");
  }
}
function NiestacjonarneProgramComponent_Conditional_2_For_38_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const sem_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(sem_r2.description);
  }
}
function NiestacjonarneProgramComponent_Conditional_2_For_38_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16)(1, "em");
    \u0275\u0275text(2, "Opis programu semestru \u2013 do uzupe\u0142nienia.");
    \u0275\u0275elementEnd()();
  }
}
function NiestacjonarneProgramComponent_Conditional_2_For_38_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 27);
    \u0275\u0275text(2, "Nazwa przedmiotu");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th", 28);
    \u0275\u0275text(4, "Typ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th", 29);
    \u0275\u0275text(6, "Kod");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th", 30);
    \u0275\u0275text(8, "Wyk\u0142ad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th", 30);
    \u0275\u0275text(10, "\u0106wiczenia");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 30);
    \u0275\u0275text(12, "Laborat.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 31);
    \u0275\u0275text(14, "Forma zal.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 32);
    \u0275\u0275text(16, "ECTS");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "th", 33);
    \u0275\u0275elementEnd();
  }
}
function NiestacjonarneProgramComponent_Conditional_2_For_38_ng_template_6_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "p-tag", 36);
  }
  if (rf & 2) {
    const rowData_r3 = \u0275\u0275nextContext().rowData;
    \u0275\u0275property("value", rowData_r3.type)("severity", rowData_r3.type === "Obowi\u0105zkowy" ? "info" : rowData_r3.type === "Obieralny specjalizacji" ? "success" : rowData_r3.type === "Specjalizacja" ? "warn" : "secondary");
  }
}
function NiestacjonarneProgramComponent_Conditional_2_For_38_ng_template_6_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 39);
    \u0275\u0275listener("onClick", function NiestacjonarneProgramComponent_Conditional_2_For_38_ng_template_6_Conditional_21_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r4);
      const rowData_r3 = \u0275\u0275nextContext().rowData;
      const ctx_r4 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r4.openDetails(rowData_r3));
    });
    \u0275\u0275elementEnd();
  }
}
function NiestacjonarneProgramComponent_Conditional_2_For_38_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 34)(1, "td");
    \u0275\u0275element(2, "p-treeTableToggler", 35);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275conditionalCreate(6, NiestacjonarneProgramComponent_Conditional_2_For_38_ng_template_6_Conditional_6_Template, 1, 2, "p-tag", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 37);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 37);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 37);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 37)(18, "strong");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td");
    \u0275\u0275conditionalCreate(21, NiestacjonarneProgramComponent_Conditional_2_For_38_ng_template_6_Conditional_21_Template, 1, 0, "p-button", 38);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const rowNode_r6 = ctx.$implicit;
    const rowData_r3 = ctx.rowData;
    \u0275\u0275classProp("group-row", rowData_r3.isGroup)("child-row", rowNode_r6.level > 0 && !rowData_r3.isGroup);
    \u0275\u0275property("ttRow", rowNode_r6);
    \u0275\u0275advance(2);
    \u0275\u0275property("rowNode", rowNode_r6);
    \u0275\u0275advance();
    \u0275\u0275classProp("group-label", rowData_r3.isGroup);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(rowData_r3.name);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!rowData_r3.isGroup || rowData_r3.type === "Specjalizacja" ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rowData_r3.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rowData_r3.lecture);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rowData_r3.tutorial);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rowData_r3.lab);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(rowData_r3.form);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(rowData_r3.ects);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!rowData_r3.isGroup ? 21 : -1);
  }
}
function NiestacjonarneProgramComponent_Conditional_2_For_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-tabpanel", 14)(1, "div", 15);
    \u0275\u0275conditionalCreate(2, NiestacjonarneProgramComponent_Conditional_2_For_38_Conditional_2_Template, 2, 1, "p")(3, NiestacjonarneProgramComponent_Conditional_2_For_38_Conditional_3_Template, 3, 0, "p", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p-treeTable", 17);
    \u0275\u0275template(5, NiestacjonarneProgramComponent_Conditional_2_For_38_ng_template_5_Template, 18, 0, "ng-template", 18)(6, NiestacjonarneProgramComponent_Conditional_2_For_38_ng_template_6_Template, 22, 17, "ng-template", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "hr", 20);
    \u0275\u0275elementStart(8, "div", 21)(9, "div", 22)(10, "span", 23);
    \u0275\u0275text(11, "Suma ECTS:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 24);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(14, "div", 11);
    \u0275\u0275elementStart(15, "div", 22)(16, "span", 23);
    \u0275\u0275text(17, "Wyk\u0142ady:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 25);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 22)(21, "span", 23);
    \u0275\u0275text(22, "\u0106wiczenia:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 25);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 22)(26, "span", 23);
    \u0275\u0275text(27, "Laboratoria:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "span", 25);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 26)(31, "span", 23);
    \u0275\u0275text(32, "\u0141\u0105cznie godzin:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 25);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const sem_r2 = ctx.$implicit;
    \u0275\u0275property("value", sem_r2.semester.toString());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(sem_r2.description ? 2 : 3);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", sem_r2.nodes)("columns", \u0275\u0275pureFunction0(10, _c2))("showGridlines", true);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(sem_r2.totalEcts);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", sem_r2.totalLecture, " h");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", sem_r2.totalTutorial, " h");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", sem_r2.totalLab, " h");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", sem_r2.totalLecture + sem_r2.totalTutorial + sem_r2.totalLab, " h");
  }
}
function NiestacjonarneProgramComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "h1", 5);
    \u0275\u0275text(2, "Program studi\xF3w \u2013 studia niestacjonarne");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 6);
    \u0275\u0275text(4, "Podsumowanie programu:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 7)(6, "div", 8)(7, "span", 9);
    \u0275\u0275text(8, "\u0141\u0105czne ECTS:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 10);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(11, "div", 11);
    \u0275\u0275elementStart(12, "div", 8)(13, "span", 9);
    \u0275\u0275text(14, "Wyk\u0142ady:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 12);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 8)(18, "span", 9);
    \u0275\u0275text(19, "\u0106wiczenia:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 12);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 8)(23, "span", 9);
    \u0275\u0275text(24, "Laboratoria:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "span", 12);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 8)(28, "span", 9);
    \u0275\u0275text(29, "\u0141\u0105cznie godzin:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "span", 12);
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(32, "p-tabs", 13)(33, "p-tablist");
    \u0275\u0275repeaterCreate(34, NiestacjonarneProgramComponent_Conditional_2_For_35_Template, 2, 2, "p-tab", 14, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "p-tabpanels");
    \u0275\u0275repeaterCreate(37, NiestacjonarneProgramComponent_Conditional_2_For_38_Template, 35, 11, "p-tabpanel", 14, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r4.totals().ects);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r4.totals().lecture, " h");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r4.totals().tutorial, " h");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r4.totals().lab, " h");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r4.totals().lecture + ctx_r4.totals().tutorial + ctx_r4.totals().lab, " h");
    \u0275\u0275advance();
    \u0275\u0275property("value", "1")("scrollable", true);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.semesters());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r4.semesters());
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275element(1, "p-progressSpinner", 44);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "\u0141adowanie sylabusa...");
    \u0275\u0275elementEnd()();
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "p-panel", 45)(2, "div", 46)(3, "span", 47);
    \u0275\u0275text(4, "Kod:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 47);
    \u0275\u0275text(8, "Typ:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 47);
    \u0275\u0275text(12, "Forma zaliczenia:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 47);
    \u0275\u0275text(16, "ECTS:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span")(18, "strong");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "span", 47);
    \u0275\u0275text(21, "Wyk\u0142ady / \u0106wiczenia / Lab.:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 42);
    \u0275\u0275element(25, "i", 48);
    \u0275\u0275elementStart(26, "em");
    \u0275\u0275text(27, "Sylabus dla tego przedmiotu nie jest jeszcze dost\u0119pny.");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("toggleable", false);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.selectedSubject().code);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r4.selectedSubject().type);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r4.selectedSubject().form);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r4.selectedSubject().ects);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate3("", ctx_r4.selectedSubject().lecture, "h / ", ctx_r4.selectedSubject().tutorial, "h / ", ctx_r4.selectedSubject().lab, "h");
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275element(1, "i", 49);
    \u0275\u0275elementStart(2, "em");
    \u0275\u0275text(3, "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 sylabusa.");
    \u0275\u0275elementEnd()();
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275element(1, "i", 61);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Informacje og\xF3lne");
    \u0275\u0275elementEnd()();
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 47);
    \u0275\u0275text(1, "Odpowiedzialny:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r7.odpowiedzialny_za_przedmiot);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_ng_template_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275element(1, "i", 62);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Godziny i punkty ECTS");
    \u0275\u0275elementEnd()();
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_ng_template_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th");
    \u0275\u0275text(2, "Wyk\u0142ady");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "\u0106wiczenia / Lektorat");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Laboratorium / Projekt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Z prowadz\u0105cym");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Praca w\u0142asna");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "\u0141\u0105cznie");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "ECTS");
    \u0275\u0275elementEnd()();
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_ng_template_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 37);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 37);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td", 37);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td", 37);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td", 37);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 37);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 37)(14, "strong");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const row_r8 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", row_r8.forma_i_liczba_godzin_zajec.wyklady ?? "-", " h");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", row_r8.forma_i_liczba_godzin_zajec.cwiczenia_lektorat_seminarium ?? "-", " h");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", row_r8.forma_i_liczba_godzin_zajec.laboratorium_projekt ?? "-", " h");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", row_r8.godziny.z_udzialem_prowadzacego_h ?? "-", " h");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", row_r8.godziny.praca_wlasna_studenta_h ?? "-", " h");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", row_r8.godziny.calkowita_liczba_godzin_h ?? "-", " h");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(row_r8.ects);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-panel", 52)(1, "p", 63);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext();
    \u0275\u0275property("toggleable", true)("collapsed", false);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r7.cel_dydaktyczny);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_36_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 65);
    \u0275\u0275text(2, "Forma zaj\u0119\u0107");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Spos\xF3b zaliczenia");
    \u0275\u0275elementEnd()();
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_36_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r9 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r9.forma);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r9.sposob);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-panel", 53)(1, "p-table", 64);
    \u0275\u0275template(2, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_36_ng_template_2_Template, 5, 0, "ng-template", 18)(3, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_36_ng_template_3_Template, 5, 2, "ng-template", 19);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext();
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275property("toggleable", true)("collapsed", false);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r4.getZaliczenieEntries(s_r7.zaliczenie))("showGridlines", true);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_37_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const k_r10 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(k_r10);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-panel", 54)(1, "ul", 66);
    \u0275\u0275repeaterCreate(2, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_37_For_3_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext();
    \u0275\u0275property("toggleable", true)("collapsed", true);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(s_r7.kryteria_oceny);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_38_For_2_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r11 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r11);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_38_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 67);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "ul", 66);
    \u0275\u0275repeaterCreate(3, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_38_For_2_For_4_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const entry_r12 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", entry_r12.forma, ":");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(entry_r12.metody);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-panel", 55);
    \u0275\u0275repeaterCreate(1, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_38_For_2_Template, 5, 1, null, null, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext();
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275property("toggleable", true)("collapsed", true);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r4.getMetodyEntries(s_r7.metody_dydaktyczne));
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_39_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "th", 65);
    \u0275\u0275text(2, "Przedmiot");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "th");
    \u0275\u0275text(4, "Wymagane zagadnienia");
    \u0275\u0275elementEnd()();
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_39_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r13 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r13.nazwa);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r13.wymagania || "\u2013");
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-panel", 56)(1, "p-table", 64);
    \u0275\u0275template(2, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_39_ng_template_2_Template, 5, 0, "ng-template", 18)(3, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_39_ng_template_3_Template, 5, 2, "ng-template", 19);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext();
    \u0275\u0275property("toggleable", true)("collapsed", true);
    \u0275\u0275advance();
    \u0275\u0275property("value", s_r7.przedmioty_wprowadzajace)("showGridlines", true);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_1_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r14 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r14);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 68);
    \u0275\u0275element(1, "i", 69);
    \u0275\u0275text(2, " Wiedza");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul", 66);
    \u0275\u0275repeaterCreate(4, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_1_For_5_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext(2);
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r4.asArray(s_r7.efekty_ksztalcenia.wiedza));
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_2_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r15 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r15);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 68);
    \u0275\u0275element(1, "i", 70);
    \u0275\u0275text(2, " Umiej\u0119tno\u015Bci");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul", 66);
    \u0275\u0275repeaterCreate(4, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_2_For_5_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext(2);
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r4.asArray(s_r7.efekty_ksztalcenia.umiejetnosci));
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_3_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r16 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r16);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 68);
    \u0275\u0275element(1, "i", 71);
    \u0275\u0275text(2, " Kompetencje spo\u0142eczne");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul", 66);
    \u0275\u0275repeaterCreate(4, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_3_For_5_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext(2);
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r4.asArray(s_r7.efekty_ksztalcenia.kompetencje_spoleczne));
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-panel", 57);
    \u0275\u0275conditionalCreate(1, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_1_Template, 6, 0);
    \u0275\u0275conditionalCreate(2, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_2_Template, 6, 0);
    \u0275\u0275conditionalCreate(3, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Conditional_3_Template, 6, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext();
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275property("toggleable", true)("collapsed", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.asArray(s_r7.efekty_ksztalcenia.wiedza).length ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.asArray(s_r7.efekty_ksztalcenia.umiejetnosci).length ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.asArray(s_r7.efekty_ksztalcenia.kompetencje_spoleczne).length ? 3 : -1);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_41_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r17 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r17);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-panel", 58)(1, "ol", 66);
    \u0275\u0275repeaterCreate(2, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_41_For_3_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext();
    \u0275\u0275property("toggleable", true)("collapsed", true);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(s_r7.tresci_programowe);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_42_Conditional_1_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r18 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r18);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_42_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 72);
    \u0275\u0275text(1, "Podstawowa:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "ul", 66);
    \u0275\u0275repeaterCreate(3, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_42_Conditional_1_For_4_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(s_r7.literatura.podstawowa.pozycje);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_42_Conditional_2_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r19 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r19);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_42_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 72);
    \u0275\u0275text(1, "Uzupe\u0142niaj\u0105ca:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "ul", 66);
    \u0275\u0275repeaterCreate(3, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_42_Conditional_2_For_4_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(s_r7.literatura.uzupelniajaca.pozycje);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p-panel", 59);
    \u0275\u0275conditionalCreate(1, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_42_Conditional_1_Template, 5, 0);
    \u0275\u0275conditionalCreate(2, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_42_Conditional_2_Template, 5, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = \u0275\u0275nextContext();
    \u0275\u0275property("toggleable", true)("collapsed", true);
    \u0275\u0275advance();
    \u0275\u0275conditional((s_r7.literatura.podstawowa == null ? null : s_r7.literatura.podstawowa.pozycje == null ? null : s_r7.literatura.podstawowa.pozycje.length) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((s_r7.literatura.uzupelniajaca == null ? null : s_r7.literatura.uzupelniajaca.pozycje == null ? null : s_r7.literatura.uzupelniajaca.pozycje.length) ? 2 : -1);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "p-card", 50);
    \u0275\u0275template(2, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_ng_template_2_Template, 4, 0, "ng-template", 18);
    \u0275\u0275elementStart(3, "div", 46)(4, "span", 47);
    \u0275\u0275text(5, "Kod przedmiotu:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span")(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 47);
    \u0275\u0275text(10, "Kierunek:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 47);
    \u0275\u0275text(14, "Tryb studi\xF3w:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 47);
    \u0275\u0275text(18, "Rok / Semestr:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 47);
    \u0275\u0275text(22, "Forma:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(25, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_25_Template, 4, 1);
    \u0275\u0275elementStart(26, "span", 47);
    \u0275\u0275text(27, "Wersja z dnia:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "span");
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "p-card", 50);
    \u0275\u0275template(31, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_ng_template_31_Template, 4, 0, "ng-template", 18);
    \u0275\u0275elementStart(32, "p-table", 51);
    \u0275\u0275template(33, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_ng_template_33_Template, 15, 0, "ng-template", 18)(34, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_ng_template_34_Template, 16, 7, "ng-template", 19);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(35, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_35_Template, 3, 3, "p-panel", 52);
    \u0275\u0275conditionalCreate(36, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_36_Template, 4, 4, "p-panel", 53);
    \u0275\u0275conditionalCreate(37, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_37_Template, 4, 2, "p-panel", 54);
    \u0275\u0275conditionalCreate(38, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_38_Template, 3, 2, "p-panel", 55);
    \u0275\u0275conditionalCreate(39, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_39_Template, 4, 4, "p-panel", 56);
    \u0275\u0275conditionalCreate(40, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_40_Template, 4, 5, "p-panel", 57);
    \u0275\u0275conditionalCreate(41, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_41_Template, 4, 2, "p-panel", 58);
    \u0275\u0275conditionalCreate(42, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Conditional_42_Template, 3, 4, "p-panel", 59);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r7 = ctx;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(s_r7.kod_przedmiotu);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", s_r7.kierunek, " \xB7 profil ", s_r7.profil);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r7.tryb_studiow);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", s_r7.rok_studiow, " / ", s_r7.semestr_studiow);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r7.obligatoryjny ? "Obowi\u0105zkowy" : "Obieralny");
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r7.odpowiedzialny_za_przedmiot ? 25 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(s_r7.wersja_z_dnia);
    \u0275\u0275advance(3);
    \u0275\u0275property("value", \u0275\u0275pureFunction1(19, _c3, s_r7))("showGridlines", true);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(s_r7.cel_dydaktyczny ? 35 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.getZaliczenieEntries(s_r7.zaliczenie).length > 0 ? 36 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((s_r7.kryteria_oceny == null ? null : s_r7.kryteria_oceny.length) ? 37 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r4.getMetodyEntries(s_r7.metody_dydaktyczne).length > 0 ? 38 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((s_r7.przedmioty_wprowadzajace == null ? null : s_r7.przedmioty_wprowadzajace.length) ? 39 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r7.efekty_ksztalcenia ? 40 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((s_r7.tresci_programowe == null ? null : s_r7.tresci_programowe.length) ? 41 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r7.literatura ? 42 : -1);
  }
}
function NiestacjonarneProgramComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, NiestacjonarneProgramComponent_Conditional_4_Conditional_0_Template, 4, 0, "div", 40);
    \u0275\u0275conditionalCreate(1, NiestacjonarneProgramComponent_Conditional_4_Conditional_1_Template, 28, 8, "div", 41);
    \u0275\u0275conditionalCreate(2, NiestacjonarneProgramComponent_Conditional_4_Conditional_2_Template, 4, 0, "div", 42);
    \u0275\u0275conditionalCreate(3, NiestacjonarneProgramComponent_Conditional_4_Conditional_3_Template, 43, 21, "div", 43);
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r4.sylabusLoading() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r4.sylabusLoading() && !ctx_r4.sylabus() && !ctx_r4.selectedSubject().syllabusFile ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r4.sylabusLoading() && !ctx_r4.sylabus() && ctx_r4.selectedSubject().syllabusFile ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_4_0 = !ctx_r4.sylabusLoading() && ctx_r4.sylabus()) ? 3 : -1, tmp_4_0);
  }
}
function NiestacjonarneProgramComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p-button", 73);
    \u0275\u0275listener("onClick", function NiestacjonarneProgramComponent_ng_template_5_Template_p_button_onClick_0_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.closeDialog());
    });
    \u0275\u0275elementEnd();
  }
}
var NiestacjonarneProgramComponent = class _NiestacjonarneProgramComponent {
  programService;
  http;
  semesters = signal([], ...ngDevMode ? [{ debugName: "semesters" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  totals = computed(() => {
    const data = this.semesters();
    return {
      ects: data.reduce((s, sem) => s + sem.totalEcts, 0),
      lecture: data.reduce((s, sem) => s + sem.totalLecture, 0),
      tutorial: data.reduce((s, sem) => s + sem.totalTutorial, 0),
      lab: data.reduce((s, sem) => s + sem.totalLab, 0)
    };
  }, ...ngDevMode ? [{ debugName: "totals" }] : []);
  dialogVisible = signal(false, ...ngDevMode ? [{ debugName: "dialogVisible" }] : []);
  dialogTitle = signal("", ...ngDevMode ? [{ debugName: "dialogTitle" }] : []);
  selectedSubject = signal(null, ...ngDevMode ? [{ debugName: "selectedSubject" }] : []);
  sylabus = signal(null, ...ngDevMode ? [{ debugName: "sylabus" }] : []);
  sylabusLoading = signal(false, ...ngDevMode ? [{ debugName: "sylabusLoading" }] : []);
  baseHref = inject(APP_BASE_HREF, { optional: true }) ?? "/";
  constructor(programService, http) {
    this.programService = programService;
    this.http = http;
  }
  ngOnInit() {
    this.programService.loadAll().subscribe({
      next: (data) => {
        this.semesters.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("B\u0142\u0105d \u0142adowania danych programu niestacjonarnego:", err);
        this.loading.set(false);
      }
    });
  }
  openDetails(subject) {
    this.selectedSubject.set(subject);
    this.dialogTitle.set(subject.name);
    this.sylabus.set(null);
    this.dialogVisible.set(true);
    if (subject.syllabusFile) {
      this.sylabusLoading.set(true);
      const base = this.baseHref.endsWith("/") ? this.baseHref : this.baseHref + "/";
      const url = `${base}${subject.syllabusFile}`;
      this.http.get(url).subscribe({
        next: (data) => {
          this.sylabus.set(data.sylabus);
          this.sylabusLoading.set(false);
        },
        error: () => {
          this.sylabusLoading.set(false);
        }
      });
    }
  }
  closeDialog() {
    this.dialogVisible.set(false);
    this.selectedSubject.set(null);
    this.sylabus.set(null);
  }
  getTypeLabel(type) {
    if (type === "M")
      return "Obowi\u0105zkowy";
    if (type === "O")
      return "Obieralny";
    return type;
  }
  asArray(val) {
    if (!val)
      return [];
    if (Array.isArray(val))
      return val;
    return [val];
  }
  getZaliczenieEntries(z) {
    if (!z)
      return [];
    return Object.entries(z).map(([forma, v]) => ({ forma, sposob: v.sposob }));
  }
  getMetodyEntries(m) {
    if (!m)
      return [];
    return Object.entries(m).filter(([, v]) => Array.isArray(v) && v.length > 0).map(([forma, v]) => ({ forma, metody: v }));
  }
  static \u0275fac = function NiestacjonarneProgramComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NiestacjonarneProgramComponent)(\u0275\u0275directiveInject(NiestacjonarneProgramService), \u0275\u0275directiveInject(HttpClient));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NiestacjonarneProgramComponent, selectors: [["app-niestacjonarne-program"]], decls: 6, vars: 13, consts: [[1, "program-page"], [1, "loading-info"], [3, "visibleChange", "onHide", "visible", "header", "modal", "contentStyle", "draggable", "resizable"], ["pTemplate", "footer"], [1, "total-summary"], [1, "page-title"], [1, "total-summary-title"], [1, "total-summary-items"], [1, "total-summary-item"], [1, "total-summary-label"], [1, "total-summary-value", "ects-value"], [1, "summary-separator"], [1, "total-summary-value"], [3, "value", "scrollable"], [3, "value"], [1, "semester-description"], [1, "description-placeholder"], ["styleClass", "p-treetable-sm semester-table", 3, "value", "columns", "showGridlines"], ["pTemplate", "header"], ["pTemplate", "body"], [1, "summary-divider"], [1, "semester-summary"], [1, "summary-item"], [1, "summary-label"], [1, "summary-value", "ects-value"], [1, "summary-value"], [1, "summary-item", "total-hours"], [2, "width", "30%"], [2, "width", "12%"], [2, "width", "6%"], [1, "text-center", 2, "width", "6%"], [2, "width", "8%"], [1, "text-center", 2, "width", "5%"], [2, "width", "11%"], [3, "ttRow"], [3, "rowNode"], ["styleClass", "type-tag", 3, "value", "severity"], [1, "text-center"], ["label", "Szczeg\xF3\u0142y", "icon", "pi pi-info-circle", "size", "small", "severity", "primary"], ["label", "Szczeg\xF3\u0142y", "icon", "pi pi-info-circle", "size", "small", "severity", "primary", 3, "onClick"], [1, "sylabus-loading"], [1, "sylabus-brak"], [1, "detail-placeholder"], [1, "sylabus-container"], ["strokeWidth", "4", "styleClass", "sylabus-spinner"], ["header", "Informacje podstawowe", "styleClass", "sylabus-panel", 3, "toggleable"], [1, "sylabus-info-grid"], [1, "info-label"], [1, "pi", "pi-info-circle", 2, "margin-right", "0.5rem"], [1, "pi", "pi-exclamation-triangle", 2, "margin-right", "0.5rem"], ["styleClass", "sylabus-card"], ["styleClass", "p-datatable-sm sylabus-hours-table", 3, "value", "showGridlines"], ["header", "Cel dydaktyczny", "styleClass", "sylabus-panel", 3, "toggleable", "collapsed"], ["header", "Forma zaliczenia", "styleClass", "sylabus-panel", 3, "toggleable", "collapsed"], ["header", "Kryteria oceny", "styleClass", "sylabus-panel", 3, "toggleable", "collapsed"], ["header", "Metody dydaktyczne", "styleClass", "sylabus-panel", 3, "toggleable", "collapsed"], ["header", "Przedmioty wprowadzaj\u0105ce", "styleClass", "sylabus-panel", 3, "toggleable", "collapsed"], ["header", "Efekty kszta\u0142cenia", "styleClass", "sylabus-panel", 3, "toggleable", "collapsed"], ["header", "Tre\u015Bci programowe", "styleClass", "sylabus-panel", 3, "toggleable", "collapsed"], ["header", "Literatura", "styleClass", "sylabus-panel", 3, "toggleable", "collapsed"], [1, "sylabus-card-header"], [1, "pi", "pi-book"], [1, "pi", "pi-clock"], [1, "sylabus-text"], ["styleClass", "p-datatable-sm", 3, "value", "showGridlines"], [2, "width", "40%"], [1, "sylabus-list"], [1, "metody-forma-label"], [1, "efekty-kategoria"], [1, "pi", "pi-lightbulb"], [1, "pi", "pi-cog"], [1, "pi", "pi-users"], [1, "literatura-typ"], ["label", "Zamknij", "icon", "pi pi-times", 3, "onClick"]], template: function NiestacjonarneProgramComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, NiestacjonarneProgramComponent_Conditional_1_Template, 2, 0, "div", 1);
      \u0275\u0275conditionalCreate(2, NiestacjonarneProgramComponent_Conditional_2_Template, 39, 7);
      \u0275\u0275elementStart(3, "p-dialog", 2);
      \u0275\u0275listener("visibleChange", function NiestacjonarneProgramComponent_Template_p_dialog_visibleChange_3_listener($event) {
        return ctx.dialogVisible.set($event);
      })("onHide", function NiestacjonarneProgramComponent_Template_p_dialog_onHide_3_listener() {
        return ctx.closeDialog();
      });
      \u0275\u0275conditionalCreate(4, NiestacjonarneProgramComponent_Conditional_4_Template, 4, 4);
      \u0275\u0275template(5, NiestacjonarneProgramComponent_ng_template_5_Template, 1, 0, "ng-template", 3);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.loading() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275styleMap(\u0275\u0275pureFunction0(11, _c0));
      \u0275\u0275property("visible", ctx.dialogVisible())("header", ctx.dialogTitle())("modal", true)("contentStyle", \u0275\u0275pureFunction0(12, _c1))("draggable", false)("resizable", false);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.selectedSubject() ? 4 : -1);
    }
  }, dependencies: [
    CommonModule,
    AccordionModule,
    PrimeTemplate,
    TabsModule,
    Tabs,
    TabPanels,
    TabPanel,
    TabList,
    Tab,
    TreeTableModule,
    TreeTable,
    TreeTableToggler,
    TTRow,
    ButtonModule,
    Button,
    DialogModule,
    Dialog,
    TagModule,
    Tag,
    PanelModule,
    Panel,
    CardModule,
    Card,
    TableModule,
    Table,
    DividerModule,
    ProgressSpinnerModule,
    ProgressSpinner
  ], styles: ["\n\n.program-page[_ngcontent-%COMP%] {\n  margin-left: 15px;\n  margin-right: 1rem;\n  padding: 2rem 0;\n}\n.page-title[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 700;\n  margin: 0 0 0.75rem 0;\n  color: #dc2626;\n}\n.loading-info[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 3rem;\n  color: #6b7280;\n  font-size: 1.1rem;\n}\n.semester-header[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.semester-ects-badge[_ngcontent-%COMP%] {\n  margin-left: 0.5rem;\n  background: #dc2626;\n  color: #fff;\n  border-radius: 9999px;\n  padding: 0.1rem 0.6rem;\n  font-size: 0.75rem;\n  font-weight: 600;\n  vertical-align: middle;\n}\n.semester-description[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n  padding: 0.75rem 1rem;\n  background: #fff5f5;\n  border-left: 4px solid #dc2626;\n  border-radius: 4px;\n  color: #374151;\n  font-size: 0.95rem;\n}\n.description-placeholder[_ngcontent-%COMP%] {\n  color: #9ca3af;\n  margin: 0;\n}\n.semester-table[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.group-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: #fff5f5 !important;\n  font-weight: 600;\n}\n.group-label[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.child-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: #fffafa;\n}\n.text-center[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.type-tag[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n}\n.summary-divider[_ngcontent-%COMP%] {\n  border: none;\n  border-top: 2px solid #d1d5db;\n  margin: 0.75rem 0;\n}\n.total-summary[_ngcontent-%COMP%] {\n  margin-top: 0;\n  margin-bottom: 1.5rem;\n  padding: 1rem 1.25rem;\n  background: #ffffff;\n  border-radius: 8px;\n  border: 1px solid #e5e7eb;\n  border-left: 4px solid #dc2626;\n}\n.total-summary-title[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 0.85rem;\n  color: #6b7280;\n  display: block;\n  margin-bottom: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n.total-summary-items[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1.25rem;\n  align-items: center;\n}\n.total-summary-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n.total-summary-label[_ngcontent-%COMP%] {\n  color: #6b7280;\n  font-size: 0.875rem;\n}\n.total-summary-value[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 1rem;\n  color: #111827;\n}\n.semester-summary[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1.25rem;\n  align-items: center;\n  padding: 0.75rem 1rem;\n  background: #e5e7eb;\n  border-radius: 6px;\n  border: 1px solid #d1d5db;\n  margin-top: 0.5rem;\n}\n.summary-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n.summary-label[_ngcontent-%COMP%] {\n  color: #6b7280;\n  font-size: 0.875rem;\n}\n.summary-value[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 0.95rem;\n  color: #111827;\n}\n.ects-value[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  color: #dc2626;\n}\n.summary-separator[_ngcontent-%COMP%] {\n  width: 1px;\n  height: 24px;\n  background: #d1d5db;\n}\n.total-hours[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.detail-placeholder[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  padding: 1rem;\n  background: #fff5f5;\n  border-radius: 6px;\n  color: #991b1b;\n  font-size: 0.9rem;\n  display: flex;\n  align-items: center;\n}\n.sylabus-loading[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1rem;\n  padding: 2.5rem 0;\n  color: #6b7280;\n}\n.sylabus-spinner[_ngcontent-%COMP%] {\n  width: 48px !important;\n  height: 48px !important;\n}\n.sylabus-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  padding: 0.25rem 0;\n}\n.sylabus-card-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-weight: 600;\n  font-size: 0.95rem;\n  padding: 0.75rem 1rem 0 1rem;\n  color: #b91c1c;\n}\n.sylabus-card[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-card-body) {\n  padding: 0.5rem 1rem 1rem 1rem;\n}\n.sylabus-info-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 180px 1fr;\n  gap: 0.35rem 0.75rem;\n  font-size: 0.875rem;\n}\n.info-label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #6b7280;\n  align-self: baseline;\n}\n.sylabus-hours-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(th), \n.sylabus-hours-table[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(td) {\n  font-size: 0.8rem !important;\n  padding: 0.4rem 0.5rem !important;\n  text-align: center;\n}\n.sylabus-panel[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-panel-header) {\n  background: #1f2937 !important;\n  color: #f9fafb !important;\n  padding: 0.6rem 1rem;\n  font-size: 0.9rem;\n  font-weight: 600;\n  border-radius: 6px 6px 0 0;\n}\n.sylabus-panel[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-panel-header .p-panel-header-icon) {\n  color: #f9fafb !important;\n}\n.sylabus-panel[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:deep(.p-panel-content) {\n  padding: 0.75rem 1rem;\n  background: #111827;\n  color: #e5e7eb;\n  border-radius: 0 0 6px 6px;\n  font-size: 0.875rem;\n}\n.sylabus-text[_ngcontent-%COMP%] {\n  line-height: 1.6;\n  margin: 0;\n}\n.sylabus-list[_ngcontent-%COMP%] {\n  margin: 0.25rem 0 0 0;\n  padding-left: 1.25rem;\n  line-height: 1.7;\n}\n.sylabus-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 0.2rem;\n}\n.metody-forma-label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #9ca3af;\n  margin: 0.5rem 0 0.15rem 0;\n  text-transform: capitalize;\n  font-size: 0.8rem;\n  letter-spacing: 0.03em;\n}\n.efekty-kategoria[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #9ca3af;\n  margin: 0.6rem 0 0.2rem 0;\n  font-size: 0.85rem;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n.literatura-typ[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #9ca3af;\n  margin: 0.5rem 0 0.2rem 0;\n  font-size: 0.82rem;\n}\n\n\n\n/*# sourceMappingURL=niestacjonarne-program.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NiestacjonarneProgramComponent, [{
    type: Component,
    args: [{ selector: "app-niestacjonarne-program", standalone: true, imports: [
      CommonModule,
      AccordionModule,
      TabsModule,
      TreeTableModule,
      ButtonModule,
      DialogModule,
      TagModule,
      PanelModule,
      CardModule,
      TableModule,
      DividerModule,
      ProgressSpinnerModule
    ], template: `<div class="program-page">\r
\r
  @if (loading()) {\r
    <div class="loading-info">\u0141adowanie danych programu...</div>\r
  }\r
\r
  @if (!loading()) {\r
\r
    <!-- Podsumowanie wszystkich semestr\xF3w -->\r
    <div class="total-summary">\r
      <h1 class="page-title">Program studi\xF3w \u2013 studia niestacjonarne</h1>\r
      <span class="total-summary-title">Podsumowanie programu:</span>\r
      <div class="total-summary-items">\r
        <div class="total-summary-item">\r
          <span class="total-summary-label">\u0141\u0105czne ECTS:</span>\r
          <span class="total-summary-value ects-value">{{ totals().ects }}</span>\r
        </div>\r
        <div class="summary-separator"></div>\r
        <div class="total-summary-item">\r
          <span class="total-summary-label">Wyk\u0142ady:</span>\r
          <span class="total-summary-value">{{ totals().lecture }} h</span>\r
        </div>\r
        <div class="total-summary-item">\r
          <span class="total-summary-label">\u0106wiczenia:</span>\r
          <span class="total-summary-value">{{ totals().tutorial }} h</span>\r
        </div>\r
        <div class="total-summary-item">\r
          <span class="total-summary-label">Laboratoria:</span>\r
          <span class="total-summary-value">{{ totals().lab }} h</span>\r
        </div>\r
        <div class="total-summary-item">\r
          <span class="total-summary-label">\u0141\u0105cznie godzin:</span>\r
          <span class="total-summary-value">{{ totals().lecture + totals().tutorial + totals().lab }} h</span>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <p-tabs [value]="'1'" [scrollable]="true">\r
\r
      <!-- Lista zak\u0142adek -->\r
      <p-tablist>\r
        @for (sem of semesters(); track sem.semester) {\r
          <p-tab [value]="sem.semester.toString()">\r
            Semestr {{ sem.semester }}\r
          </p-tab>\r
        }\r
      </p-tablist>\r
\r
      <!-- Zawarto\u015B\u0107 zak\u0142adek -->\r
      <p-tabpanels>\r
        @for (sem of semesters(); track sem.semester) {\r
          <p-tabpanel [value]="sem.semester.toString()">\r
\r
            <!-- Opis semestru -->\r
            <div class="semester-description">\r
              @if (sem.description) {\r
                <p>{{ sem.description }}</p>\r
              } @else {\r
                <p class="description-placeholder"><em>Opis programu semestru \u2013 do uzupe\u0142nienia.</em></p>\r
              }\r
            </div>\r
\r
            <!-- TreeTable z przedmiotami -->\r
            <p-treeTable\r
              [value]="sem.nodes"\r
              [columns]="[]"\r
              styleClass="p-treetable-sm semester-table"\r
              [showGridlines]="true"\r
            >\r
              <ng-template pTemplate="header">\r
                <tr>\r
                  <th style="width: 30%">Nazwa przedmiotu</th>\r
                  <th style="width: 12%">Typ</th>\r
                  <th style="width: 6%">Kod</th>\r
                  <th style="width: 6%" class="text-center">Wyk\u0142ad</th>\r
                  <th style="width: 6%" class="text-center">\u0106wiczenia</th>\r
                  <th style="width: 6%" class="text-center">Laborat.</th>\r
                  <th style="width: 8%">Forma zal.</th>\r
                  <th style="width: 5%" class="text-center">ECTS</th>\r
                  <th style="width: 11%"></th>\r
                </tr>\r
              </ng-template>\r
\r
              <ng-template pTemplate="body" let-rowNode let-rowData="rowData">\r
                <tr [ttRow]="rowNode" [class.group-row]="rowData.isGroup" [class.child-row]="rowNode.level > 0 && !rowData.isGroup">\r
                  <td>\r
                    <p-treeTableToggler [rowNode]="rowNode" />\r
                    <span [class.group-label]="rowData.isGroup">{{ rowData.name }}</span>\r
                  </td>\r
                  <td>\r
                    @if (!rowData.isGroup || rowData.type === 'Specjalizacja') {\r
                      <p-tag\r
                        [value]="rowData.type"\r
                        [severity]="rowData.type === 'Obowi\u0105zkowy' ? 'info' : rowData.type === 'Obieralny specjalizacji' ? 'success' : rowData.type === 'Specjalizacja' ? 'warn' : 'secondary'"\r
                        styleClass="type-tag"\r
                      />\r
                    }\r
                  </td>\r
                  <td>{{ rowData.code }}</td>\r
                  <td class="text-center">{{ rowData.lecture }}</td>\r
                  <td class="text-center">{{ rowData.tutorial }}</td>\r
                  <td class="text-center">{{ rowData.lab }}</td>\r
                  <td>{{ rowData.form }}</td>\r
                  <td class="text-center"><strong>{{ rowData.ects }}</strong></td>\r
                  <td>\r
                    @if (!rowData.isGroup) {\r
                      <p-button\r
                        label="Szczeg\xF3\u0142y"\r
                        icon="pi pi-info-circle"\r
                        size="small"\r
                        severity="primary"\r
                        (onClick)="openDetails(rowData)"\r
                      />\r
                    }\r
                  </td>\r
                </tr>\r
              </ng-template>\r
            </p-treeTable>\r
\r
            <!-- Podsumowanie semestru -->\r
            <hr class="summary-divider" />\r
            <div class="semester-summary">\r
              <div class="summary-item">\r
                <span class="summary-label">Suma ECTS:</span>\r
                <span class="summary-value ects-value">{{ sem.totalEcts }}</span>\r
              </div>\r
              <div class="summary-separator"></div>\r
              <div class="summary-item">\r
                <span class="summary-label">Wyk\u0142ady:</span>\r
                <span class="summary-value">{{ sem.totalLecture }} h</span>\r
              </div>\r
              <div class="summary-item">\r
                <span class="summary-label">\u0106wiczenia:</span>\r
                <span class="summary-value">{{ sem.totalTutorial }} h</span>\r
              </div>\r
              <div class="summary-item">\r
                <span class="summary-label">Laboratoria:</span>\r
                <span class="summary-value">{{ sem.totalLab }} h</span>\r
              </div>\r
              <div class="summary-item total-hours">\r
                <span class="summary-label">\u0141\u0105cznie godzin:</span>\r
                <span class="summary-value">{{ sem.totalLecture + sem.totalTutorial + sem.totalLab }} h</span>\r
              </div>\r
            </div>\r
\r
          </p-tabpanel>\r
        }\r
      </p-tabpanels>\r
\r
    </p-tabs>\r
  }\r
\r
  <!-- Dialog szczeg\xF3\u0142\xF3w przedmiotu -->\r
  <p-dialog\r
    [visible]="dialogVisible()"\r
    (visibleChange)="dialogVisible.set($event)"\r
    [header]="dialogTitle()"\r
    [modal]="true"\r
    [style]="{ width: '860px', maxWidth: '98vw' }"\r
    [contentStyle]="{ 'max-height': '80vh', 'overflow-y': 'auto' }"\r
    [draggable]="false"\r
    [resizable]="false"\r
    (onHide)="closeDialog()"\r
  >\r
    @if (selectedSubject()) {\r
      @if (sylabusLoading()) {\r
        <div class="sylabus-loading">\r
          <p-progressSpinner strokeWidth="4" styleClass="sylabus-spinner" />\r
          <span>\u0141adowanie sylabusa...</span>\r
        </div>\r
      }\r
      @if (!sylabusLoading() && !sylabus() && !selectedSubject()!.syllabusFile) {\r
        <div class="sylabus-brak">\r
          <p-panel header="Informacje podstawowe" [toggleable]="false" styleClass="sylabus-panel">\r
            <div class="sylabus-info-grid">\r
              <span class="info-label">Kod:</span><span>{{ selectedSubject()!.code }}</span>\r
              <span class="info-label">Typ:</span><span>{{ selectedSubject()!.type }}</span>\r
              <span class="info-label">Forma zaliczenia:</span><span>{{ selectedSubject()!.form }}</span>\r
              <span class="info-label">ECTS:</span><span><strong>{{ selectedSubject()!.ects }}</strong></span>\r
              <span class="info-label">Wyk\u0142ady / \u0106wiczenia / Lab.:</span>\r
              <span>{{ selectedSubject()!.lecture }}h / {{ selectedSubject()!.tutorial }}h / {{ selectedSubject()!.lab }}h</span>\r
            </div>\r
          </p-panel>\r
          <div class="detail-placeholder">\r
            <i class="pi pi-info-circle" style="margin-right:0.5rem;"></i>\r
            <em>Sylabus dla tego przedmiotu nie jest jeszcze dost\u0119pny.</em>\r
          </div>\r
        </div>\r
      }\r
      @if (!sylabusLoading() && !sylabus() && selectedSubject()!.syllabusFile) {\r
        <div class="detail-placeholder">\r
          <i class="pi pi-exclamation-triangle" style="margin-right:0.5rem;"></i>\r
          <em>Nie uda\u0142o si\u0119 za\u0142adowa\u0107 sylabusa.</em>\r
        </div>\r
      }\r
      @if (!sylabusLoading() && sylabus(); as s) {\r
        <div class="sylabus-container">\r
          <p-card styleClass="sylabus-card">\r
            <ng-template pTemplate="header">\r
              <div class="sylabus-card-header"><i class="pi pi-book"></i><span>Informacje og\xF3lne</span></div>\r
            </ng-template>\r
            <div class="sylabus-info-grid">\r
              <span class="info-label">Kod przedmiotu:</span><span><strong>{{ s.kod_przedmiotu }}</strong></span>\r
              <span class="info-label">Kierunek:</span><span>{{ s.kierunek }} \xB7 profil {{ s.profil }}</span>\r
              <span class="info-label">Tryb studi\xF3w:</span><span>{{ s.tryb_studiow }}</span>\r
              <span class="info-label">Rok / Semestr:</span><span>{{ s.rok_studiow }} / {{ s.semestr_studiow }}</span>\r
              <span class="info-label">Forma:</span><span>{{ s.obligatoryjny ? 'Obowi\u0105zkowy' : 'Obieralny' }}</span>\r
              @if (s.odpowiedzialny_za_przedmiot) {\r
                <span class="info-label">Odpowiedzialny:</span><span>{{ s.odpowiedzialny_za_przedmiot }}</span>\r
              }\r
              <span class="info-label">Wersja z dnia:</span><span>{{ s.wersja_z_dnia }}</span>\r
            </div>\r
          </p-card>\r
          <p-card styleClass="sylabus-card">\r
            <ng-template pTemplate="header">\r
              <div class="sylabus-card-header"><i class="pi pi-clock"></i><span>Godziny i punkty ECTS</span></div>\r
            </ng-template>\r
            <p-table [value]="[s]" styleClass="p-datatable-sm sylabus-hours-table" [showGridlines]="true">\r
              <ng-template pTemplate="header">\r
                <tr>\r
                  <th>Wyk\u0142ady</th><th>\u0106wiczenia / Lektorat</th><th>Laboratorium / Projekt</th>\r
                  <th>Z prowadz\u0105cym</th><th>Praca w\u0142asna</th><th>\u0141\u0105cznie</th><th>ECTS</th>\r
                </tr>\r
              </ng-template>\r
              <ng-template pTemplate="body" let-row>\r
                <tr>\r
                  <td class="text-center">{{ row.forma_i_liczba_godzin_zajec.wyklady ?? '-' }} h</td>\r
                  <td class="text-center">{{ row.forma_i_liczba_godzin_zajec.cwiczenia_lektorat_seminarium ?? '-' }} h</td>\r
                  <td class="text-center">{{ row.forma_i_liczba_godzin_zajec.laboratorium_projekt ?? '-' }} h</td>\r
                  <td class="text-center">{{ row.godziny.z_udzialem_prowadzacego_h ?? '-' }} h</td>\r
                  <td class="text-center">{{ row.godziny.praca_wlasna_studenta_h ?? '-' }} h</td>\r
                  <td class="text-center">{{ row.godziny.calkowita_liczba_godzin_h ?? '-' }} h</td>\r
                  <td class="text-center"><strong>{{ row.ects }}</strong></td>\r
                </tr>\r
              </ng-template>\r
            </p-table>\r
          </p-card>\r
          @if (s.cel_dydaktyczny) {\r
            <p-panel header="Cel dydaktyczny" [toggleable]="true" [collapsed]="false" styleClass="sylabus-panel">\r
              <p class="sylabus-text">{{ s.cel_dydaktyczny }}</p>\r
            </p-panel>\r
          }\r
          @if (getZaliczenieEntries(s.zaliczenie).length > 0) {\r
            <p-panel header="Forma zaliczenia" [toggleable]="true" [collapsed]="false" styleClass="sylabus-panel">\r
              <p-table [value]="getZaliczenieEntries(s.zaliczenie)" styleClass="p-datatable-sm" [showGridlines]="true">\r
                <ng-template pTemplate="header"><tr><th style="width:40%">Forma zaj\u0119\u0107</th><th>Spos\xF3b zaliczenia</th></tr></ng-template>\r
                <ng-template pTemplate="body" let-row><tr><td>{{ row.forma }}</td><td>{{ row.sposob }}</td></tr></ng-template>\r
              </p-table>\r
            </p-panel>\r
          }\r
          @if (s.kryteria_oceny?.length) {\r
            <p-panel header="Kryteria oceny" [toggleable]="true" [collapsed]="true" styleClass="sylabus-panel">\r
              <ul class="sylabus-list">@for (k of s.kryteria_oceny; track $index) { <li>{{ k }}</li> }</ul>\r
            </p-panel>\r
          }\r
          @if (getMetodyEntries(s.metody_dydaktyczne).length > 0) {\r
            <p-panel header="Metody dydaktyczne" [toggleable]="true" [collapsed]="true" styleClass="sylabus-panel">\r
              @for (entry of getMetodyEntries(s.metody_dydaktyczne); track entry.forma) {\r
                <p class="metody-forma-label">{{ entry.forma }}:</p>\r
                <ul class="sylabus-list">@for (m of entry.metody; track $index) { <li>{{ m }}</li> }</ul>\r
              }\r
            </p-panel>\r
          }\r
          @if (s.przedmioty_wprowadzajace?.length) {\r
            <p-panel header="Przedmioty wprowadzaj\u0105ce" [toggleable]="true" [collapsed]="true" styleClass="sylabus-panel">\r
              <p-table [value]="s.przedmioty_wprowadzajace" styleClass="p-datatable-sm" [showGridlines]="true">\r
                <ng-template pTemplate="header"><tr><th style="width:40%">Przedmiot</th><th>Wymagane zagadnienia</th></tr></ng-template>\r
                <ng-template pTemplate="body" let-row><tr><td>{{ row.nazwa }}</td><td>{{ row.wymagania || '\u2013' }}</td></tr></ng-template>\r
              </p-table>\r
            </p-panel>\r
          }\r
          @if (s.efekty_ksztalcenia) {\r
            <p-panel header="Efekty kszta\u0142cenia" [toggleable]="true" [collapsed]="true" styleClass="sylabus-panel">\r
              @if (asArray(s.efekty_ksztalcenia.wiedza).length) {\r
                <p class="efekty-kategoria"><i class="pi pi-lightbulb"></i> Wiedza</p>\r
                <ul class="sylabus-list">@for (e of asArray(s.efekty_ksztalcenia.wiedza); track $index) { <li>{{ e }}</li> }</ul>\r
              }\r
              @if (asArray(s.efekty_ksztalcenia.umiejetnosci).length) {\r
                <p class="efekty-kategoria"><i class="pi pi-cog"></i> Umiej\u0119tno\u015Bci</p>\r
                <ul class="sylabus-list">@for (e of asArray(s.efekty_ksztalcenia.umiejetnosci); track $index) { <li>{{ e }}</li> }</ul>\r
              }\r
              @if (asArray(s.efekty_ksztalcenia.kompetencje_spoleczne).length) {\r
                <p class="efekty-kategoria"><i class="pi pi-users"></i> Kompetencje spo\u0142eczne</p>\r
                <ul class="sylabus-list">@for (e of asArray(s.efekty_ksztalcenia.kompetencje_spoleczne); track $index) { <li>{{ e }}</li> }</ul>\r
              }\r
            </p-panel>\r
          }\r
          @if (s.tresci_programowe?.length) {\r
            <p-panel header="Tre\u015Bci programowe" [toggleable]="true" [collapsed]="true" styleClass="sylabus-panel">\r
              <ol class="sylabus-list">@for (t of s.tresci_programowe; track $index) { <li>{{ t }}</li> }</ol>\r
            </p-panel>\r
          }\r
          @if (s.literatura) {\r
            <p-panel header="Literatura" [toggleable]="true" [collapsed]="true" styleClass="sylabus-panel">\r
              @if (s.literatura.podstawowa?.pozycje?.length) {\r
                <p class="literatura-typ">Podstawowa:</p>\r
                <ul class="sylabus-list">@for (p of s.literatura.podstawowa!.pozycje; track $index) { <li>{{ p }}</li> }</ul>\r
              }\r
              @if (s.literatura.uzupelniajaca?.pozycje?.length) {\r
                <p class="literatura-typ">Uzupe\u0142niaj\u0105ca:</p>\r
                <ul class="sylabus-list">@for (p of s.literatura.uzupelniajaca!.pozycje; track $index) { <li>{{ p }}</li> }</ul>\r
              }\r
            </p-panel>\r
          }\r
        </div>\r
      }\r
    }\r
    <ng-template pTemplate="footer">\r
      <p-button label="Zamknij" icon="pi pi-times" (onClick)="closeDialog()" />\r
    </ng-template>\r
  </p-dialog>\r
</div>\r
\r
`, styles: ["/* src/app/stacjonarne/program/program.component.css */\n.program-page {\n  margin-left: 15px;\n  margin-right: 1rem;\n  padding: 2rem 0;\n}\n.page-title {\n  font-size: 1.75rem;\n  font-weight: 700;\n  margin: 0 0 0.75rem 0;\n  color: #dc2626;\n}\n.loading-info {\n  text-align: center;\n  padding: 3rem;\n  color: #6b7280;\n  font-size: 1.1rem;\n}\n.semester-header {\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.semester-ects-badge {\n  margin-left: 0.5rem;\n  background: #dc2626;\n  color: #fff;\n  border-radius: 9999px;\n  padding: 0.1rem 0.6rem;\n  font-size: 0.75rem;\n  font-weight: 600;\n  vertical-align: middle;\n}\n.semester-description {\n  margin-bottom: 1rem;\n  padding: 0.75rem 1rem;\n  background: #fff5f5;\n  border-left: 4px solid #dc2626;\n  border-radius: 4px;\n  color: #374151;\n  font-size: 0.95rem;\n}\n.description-placeholder {\n  color: #9ca3af;\n  margin: 0;\n}\n.semester-table {\n  margin-bottom: 1rem;\n}\n.group-row td {\n  background: #fff5f5 !important;\n  font-weight: 600;\n}\n.group-label {\n  font-weight: 600;\n}\n.child-row td {\n  background: #fffafa;\n}\n.text-center {\n  text-align: center;\n}\n.type-tag {\n  font-size: 0.75rem;\n}\n.summary-divider {\n  border: none;\n  border-top: 2px solid #d1d5db;\n  margin: 0.75rem 0;\n}\n.total-summary {\n  margin-top: 0;\n  margin-bottom: 1.5rem;\n  padding: 1rem 1.25rem;\n  background: #ffffff;\n  border-radius: 8px;\n  border: 1px solid #e5e7eb;\n  border-left: 4px solid #dc2626;\n}\n.total-summary-title {\n  font-weight: 700;\n  font-size: 0.85rem;\n  color: #6b7280;\n  display: block;\n  margin-bottom: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n.total-summary-items {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1.25rem;\n  align-items: center;\n}\n.total-summary-item {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n.total-summary-label {\n  color: #6b7280;\n  font-size: 0.875rem;\n}\n.total-summary-value {\n  font-weight: 700;\n  font-size: 1rem;\n  color: #111827;\n}\n.semester-summary {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1.25rem;\n  align-items: center;\n  padding: 0.75rem 1rem;\n  background: #e5e7eb;\n  border-radius: 6px;\n  border: 1px solid #d1d5db;\n  margin-top: 0.5rem;\n}\n.summary-item {\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n.summary-label {\n  color: #6b7280;\n  font-size: 0.875rem;\n}\n.summary-value {\n  font-weight: 600;\n  font-size: 0.95rem;\n  color: #111827;\n}\n.ects-value {\n  font-size: 1.1rem;\n  color: #dc2626;\n}\n.summary-separator {\n  width: 1px;\n  height: 24px;\n  background: #d1d5db;\n}\n.total-hours {\n  margin-left: auto;\n}\n.detail-placeholder {\n  margin-top: 1rem;\n  padding: 1rem;\n  background: #fff5f5;\n  border-radius: 6px;\n  color: #991b1b;\n  font-size: 0.9rem;\n  display: flex;\n  align-items: center;\n}\n.sylabus-loading {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1rem;\n  padding: 2.5rem 0;\n  color: #6b7280;\n}\n.sylabus-spinner {\n  width: 48px !important;\n  height: 48px !important;\n}\n.sylabus-container {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  padding: 0.25rem 0;\n}\n.sylabus-card-header {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-weight: 600;\n  font-size: 0.95rem;\n  padding: 0.75rem 1rem 0 1rem;\n  color: #b91c1c;\n}\n.sylabus-card :deep(.p-card-body) {\n  padding: 0.5rem 1rem 1rem 1rem;\n}\n.sylabus-info-grid {\n  display: grid;\n  grid-template-columns: 180px 1fr;\n  gap: 0.35rem 0.75rem;\n  font-size: 0.875rem;\n}\n.info-label {\n  font-weight: 600;\n  color: #6b7280;\n  align-self: baseline;\n}\n.sylabus-hours-table :deep(th),\n.sylabus-hours-table :deep(td) {\n  font-size: 0.8rem !important;\n  padding: 0.4rem 0.5rem !important;\n  text-align: center;\n}\n.sylabus-panel :deep(.p-panel-header) {\n  background: #1f2937 !important;\n  color: #f9fafb !important;\n  padding: 0.6rem 1rem;\n  font-size: 0.9rem;\n  font-weight: 600;\n  border-radius: 6px 6px 0 0;\n}\n.sylabus-panel :deep(.p-panel-header .p-panel-header-icon) {\n  color: #f9fafb !important;\n}\n.sylabus-panel :deep(.p-panel-content) {\n  padding: 0.75rem 1rem;\n  background: #111827;\n  color: #e5e7eb;\n  border-radius: 0 0 6px 6px;\n  font-size: 0.875rem;\n}\n.sylabus-text {\n  line-height: 1.6;\n  margin: 0;\n}\n.sylabus-list {\n  margin: 0.25rem 0 0 0;\n  padding-left: 1.25rem;\n  line-height: 1.7;\n}\n.sylabus-list li {\n  margin-bottom: 0.2rem;\n}\n.metody-forma-label {\n  font-weight: 600;\n  color: #9ca3af;\n  margin: 0.5rem 0 0.15rem 0;\n  text-transform: capitalize;\n  font-size: 0.8rem;\n  letter-spacing: 0.03em;\n}\n.efekty-kategoria {\n  font-weight: 600;\n  color: #9ca3af;\n  margin: 0.6rem 0 0.2rem 0;\n  font-size: 0.85rem;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n}\n.literatura-typ {\n  font-weight: 600;\n  color: #9ca3af;\n  margin: 0.5rem 0 0.2rem 0;\n  font-size: 0.82rem;\n}\n\n/* src/app/niestacjonarne/program/niestacjonarne-program.component.css */\n/*# sourceMappingURL=niestacjonarne-program.component.css.map */\n"] }]
  }], () => [{ type: NiestacjonarneProgramService }, { type: HttpClient }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NiestacjonarneProgramComponent, { className: "NiestacjonarneProgramComponent", filePath: "src/app/niestacjonarne/program/niestacjonarne-program.component.ts", lineNumber: 39 });
})();
export {
  NiestacjonarneProgramComponent
};
//# sourceMappingURL=chunk-UCJXZGMN.js.map
