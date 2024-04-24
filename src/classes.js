export class Thing {
  constructor(theThing, category, details = []) {
    this.itemId = `${theThing}-${Math.random()}`;
    this.theThing = theThing;
    this.category = category;
    this.details = details;
  }
}

export class Task {
  constructor(content, category) {
    this.id = `${content}_${Math.random()}`;
    this.content = content;
    this.columnIdx = category;
    this.details = [];
  }
}

export class Detail {
  constructor(text, isChecked = false) {
    this.detailId = Math.random();
    this.text = text;
    this.isChecked = isChecked;
  }
}
