const express = require("express");
const Router = express.Router();
const restrictAccess = require("./middleware").restrictAccess;
const checkAdmin = require("./middleware").checkAdmin;

const Course = require("./schema/course");
const Info = require("./schema/info");

function checkAuthor(authorLists, query) {
  for (let i of authorLists) {
    if (i.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
      return true;
    }
  }
  return false;
}

function checkKeyword(name, query) {
  const queryKeywords = query.split(" ");
  const keywords = name.split(" ");
  for (let i of keywords) {
    for (let x of queryKeywords) {
      if (i.indexOf(x) >= 0) {
        return true;
      }
    }
  }
  return false;
}

function checkForTopic(topicList, topic) {
  if (topic.length === 0) return true;
  for (let i of topicList) {
    for(let x of topic){
      if (i.toLowerCase() === x.toLowerCase()) {
        return true;
      }
    }
  }
  return false;
}

// 0 - All, 1 - Beginner, 2 - Intermidiate, 3 - Expert
function checkForLevel(courseLevel, level) {
  if (!level) return true;
  return courseLevel == level;
}

function checkForLength(courseLength, length) {
  const len = parseInt(courseLength);
  if (!length) return true;
  if (length === "0-1") return len > 0 && len <= 1;
  else if (length === "1-3") return len > 1 && len <= 3;
  else if (length === "6-7") return len > 6 && len <= 7;
  else if (length === "17") return len >= 17;

  return false;
}

// GET ROUTES

// short(0) & modium(1) & long(2)
// course?id=""&mode="0/1/2"
Router.get("/course/single", restrictAccess, async (req, res) => {
  const courseId = req.query.courseId;
  const mode = parseInt(req.query.mode || 0);

  try {
    const query = {content: 0};
    if (mode === 0) {
      query.trailer = 0;
      query.links = 0;
      query.topics = 0;
    } else if (mode === 1) {
      query.trailer = 0;
      query.links = 0;
    } else if (mode === 2) {
      delete query.content;
    }

    const course = await Course.findById(courseId, query);
    return res.json({ success: true, course: course });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err: "Bad Request" });
  }
});

Router.get("/course/search", restrictAccess, async (req, res) => {
  const topic = !req.query.topic?[]:req.query.topic?.split(",") || [];
  const level = req.query.level; // 0 1 2 3
  const time = req.query.length; // 0-1, 1-3, 6-7, 17+
  const query = req.query.q || "";

  const course = await Course.find({}, {content: 0});

  const exactMatch = [];
  const authorMatch = [];
  const keyWordsMatch = [];

  let topics = [];

  if (!query) {
    return res.status(400).json({ success: false, err: "No query" });
  }

  for (let i = 0; i < course.length; i++) {
    const currentCourse = course[i]["_doc"];
    if (currentCourse.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
      topics = [...currentCourse.topics, ...topics ];
      if (!checkForTopic(currentCourse.topics, topic)) continue;
      if (!checkForLevel(currentCourse.info.level, level)) continue;
      if (!checkForLength(currentCourse.info.hrs, time)) continue;
      exactMatch.push(currentCourse);
    } else if (checkAuthor(currentCourse.instructors, query)) {
      topics = [...currentCourse.topics, ...topics ];
      if (!checkForTopic(currentCourse.topics, topic)) continue;
      if (!checkForLevel(currentCourse.info.level, level)) continue;
      if (!checkForLength(currentCourse.info.hrs, time)) continue;

      authorMatch.push(currentCourse);
    } else if (checkKeyword(currentCourse.name, query)) {
      topics = [...currentCourse.topics, ...topics ];
      if (!checkForTopic(currentCourse.topics, topic)) continue;
      if (!checkForLevel(currentCourse.info.level, level)) continue;
      if (!checkForLength(currentCourse.info.hrs, time)) continue;

      keyWordsMatch.push(currentCourse);
    }
  }

  const productDB = [...exactMatch, ...authorMatch, ...keyWordsMatch];
  const splitResponce = [];
  let totalPages = 0;
  let page = 0;

  if(productDB.length>0) {
    const pagesize = parseInt(req.query.pagesize) || 1;
    page = parseInt(req.query.page) || 1;
  
    totalPages = Math.ceil(productDB.length / pagesize);
    const pageEndIndex = pagesize * page;
  
    if (page > totalPages) {
      return res.status(400).json({ success: false, err: "Page out of index" });
    }
  
    if (totalPages === page) {
      for (let i = pageEndIndex - pagesize; i < productDB.length; i++) {
        splitResponce.push(productDB[i]);
      }
    } else {
      for (let i = pageEndIndex - pagesize; i < pageEndIndex; i++) {
        splitResponce.push(productDB[i]);
      }
    }
  }

  return res.json({
    success: true,
    courses: splitResponce,
    topics: Array.from(new Set(topics)),
    totalPages,
    currentPage: page,
    totalCourses: productDB.length
  });
});

// Carousel
Router.get("/info", restrictAccess, async (req, res) => {
  const data = (await Info.find())[0];
  res.json({
    success: true,
    carousel: data.carousel || [],
    categories: data.categories || [],
    topCat: data.topCat || [],
    section: data.section || [],
  });
});

// Blogs Suggestion - Fixed
Router.get("/blogs/", restrictAccess, (req, res) => {});

// Post Routes
Router.post("/course", restrictAccess, checkAdmin, async (req, res) => {
  try {
    const newCourse = new Course({
      img: req.body.img,
      name: req.body.name,
      description: req.body.description,
      info: req.body.info,
      instructors: req.body.instructors,
      lastUpdated: Date.now(),
      topics: req.body.topics,
      links: req.body.links,
      trailer: req.body.trailer,
      content: req.body.content,
    });

    await newCourse.save();
    return res.json({ success: true, msg: "Course Added" });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, err: "Bad Request: Missing Values" });
  }
});

// Delete Routes
Router.delete("/course", restrictAccess, checkAdmin, async (req, res) => {
  try {
    await Course.findByIdAndRemove(req.body.courseId);
    // Send OTP
    return res.json({ success: true, msg: "Course deleted" });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, err: "Bad Request: Id is incorrect" });
  }
});

// Patch Routes
Router.patch("/course", restrictAccess, checkAdmin, async (req, res) => {
  const filedsToUpdate = Object.keys(req.body);

  const updatedCourse = {};

  filedsToUpdate.forEach((field) => {
    updatedCourse[field] = req.body[field];
  });

  updatedCourse.lastUpdated = Date.now();

  try {
    await Course.findByIdAndUpdate(req.body.courseId, updatedCourse);
    return res.json({ success: true, err: "course updated" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, err: "Bad Request" });
  }
});

Router.patch("/info", restrictAccess, checkAdmin, async (req, res) => {
  const data = await Info.find();
  if (data.length > 0) {
    await Info.findByIdAndUpdate(data[0]._id, {
      carousel: req.body.carousel || data[0].carousel,
      categories: req.body.categories || data[0].categories,
      topCat: req.body.topCat || data[0].topCat,
      section: req.body.section || data[0].topCat,
    });
  } else {
    await new Info({
      carousel: req.body.carousel,
      categories: req.body.categories,
      topCat: req.body.topCat,
      section: req.body.section,
    }).save();
  }

  res.json({ success: true, msg: "Info Updated" });
});

module.exports = Router;
