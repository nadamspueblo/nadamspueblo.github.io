class Lesson {
  constructor(academicIntegration, agenda, assessment, cteProgram, duration, labTitle, labDuration, lessonNum,
    lessonTitle, notes, objectives, profStandards, school, startDate, teacherName, techStandards,
    unitNum, unitTitle, vocab, workBasedLearning) {
      this.academicIntegration = academicIntegration;
      this.agenda = agenda;
      this.assessment = assessment;
      this.cteProgram = cteProgram;
      this.duration = duration;
      this.labTitle = labTitle;
      this.labDuration = labDuration;
      this.lessonNum = lessonNum;
      this.lessonTitle = lessonTitle;
      this.notes = notes;
      this.objectives = objectives;
      this.profStandards = profStandards;
      this.school = school;
      this.startDate = startDate;
      this.teacherName = teacherName;
      this.techStandards = techStandards;
      this.unitNum = unitNum;
      this.unitTitle = unitTitle;
      this.vocab = vocab;
      this.workBasedLearning = workBasedLearning;
      this.lessons = [];
    }
}



var lessonConverter = {
  toFirestore: function (lesson) {
    return {
      "academic-integration": lesson.academicIntegration,
      agenda: lesson.agenda,
      assessment: lesson.assessment,
      "cte-program": lesson.cteProgram,
      duration: lesson.duration,
      "lab-title": lesson.labTitle,
      "lab-duration": lesson.labDuration,
      "lesson-num": lesson.lessonNum,
      "lesson-title": lesson.lessonTitle,
      notes: lesson.notes,
      objectives: lesson.objectives,
      "prof-standards": lesson.profStandards,
      school: lesson.school,
      "start-date": lesson.startDate,
      "teacher-name": lesson.teacherName,
      "tech-standards": lesson.techStandards,
      "unit-num": unitNum,
      "unit-title": lesson.unitTitle,
      vocab: lesson.vocab,
      "work-based-learning": workBasedLearning
    }
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Lesson(data["academic-integration"], data["agenda"], data["assessment"], data["cte-program"],
      parseInt(data["duration"]), data["lab-title"], parseInt(data["lab-duration"]), parseInt(data["lesson-num"]), data["lesson-title"], data["notes"], data["objectives"],
      data["prof-standards"], data["school"], data["start-date"], data["teacher-name"], data["tech-standards"], parseInt(data["unit-num"]),
      data["unit-title"], data["vocab"], data["work-based-learning"]);
  }
};
