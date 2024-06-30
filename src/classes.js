export class Task {
  constructor(content) {
    this.id = `${content}_${Math.random()}`;
    this.content = content; // to phase out
    // this.columnIdx = category;
    this.details = [];
    this.subjectName = content;
  }
}

export class Detail {
  constructor(text, isChecked = false) {
    this.detailId = Math.random();
    this.text = text; // to phase out
    this.description = text;
    this.isChecked = isChecked;
  }
}
