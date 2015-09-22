//Data
var bio = {
    "name": "Utku Sahin",
    "role": "Front-End Apprentice",
    "contacts":
        {
            "email": "vshane668@gmail.com",
            "phone": "(478)-444-8418",
            "github": "github.com/Haskman",
            "location": "Bayrakli, Izmir, Turkey"
        },
    "message": "Here is my online resume!",
    "skills": ["HTML+CSS",
        "bootstrap.css",
        "Adobe CC Suite",
        "javaScript",
        "jQuery"]
}

var work = {
    "jobs": [{

        "title": "Student Assistant",
        "employer": "Kennesaw State University",
        "department": "Office of Finance and Accounting",
        "date_started": "July 2015",
        "date_ended": "August 2015",
        "location": "Kennesaw, GA",
        "description": "Document processing, clerical tasks, front desk"
    }],


}

var projects = {
    "projects": [
        {
            "title": "Neurish",
            "description": "A location-based social media app for epilepsy patients to allow them to connect with other epilepsy" +
            " patients as well as mentors and healthcare providers.",
            "date_started": "April 2015",
            "date_finished": "Present",
            "images": ["images/neurish_1.png","images/neurish_2.png","images/neurish_3.png","images/neurish_4.png"]
        }
    ]
}


var education = {
    "schools": [
            {
                "name": "Kennesaw State University",
                "degree": "BSc",
                "date_started": "Aug 2014",
                "date_finished": "Present",
                "major": "Computer Science",
                "city": "Kennesaw, GA",
                "url": "http://www.kennesaw.edu"
            }
        ],
    "onlineCourses": [{
        "name": "Front-End Development Nanodegree",
        "school": "Udacity",
        "date_started": "July 2015",
        "date_finished": "Present",
        "url": "https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001"
        },
        {
        "name": "Data Science Specialization",
        "school": "Coursera",
        "date_started": "August 2015",
        "date_finished": "Present",
        "url": "https://www.coursera.org/specializations/jhudatascience"
        },
    ]
}

projects.display = function () {
    for (project in projects.projects) {
        $("#projects").append(HTMLprojectStart);

        var formattedProjectTitle = HTMLprojectTitle.replace("%data%", projects.projects[project].title);
        $(".project-entry:last").append(formattedProjectTitle);

        var formattedProjectDescription = HTMLprojectDescription.replace("%data%", projects.projects[project].description);
        $(".project-entry:last").append(formattedProjectDescription);

        var formattedProjectDates = HTMLprojectDates.replace("%data%", projects.projects[project].date_started + "-" + projects.projects[project].date_finished);
        $(".project-entry:last").append(formattedProjectDates);

        if (projects.projects[project].images.length > 0) {
            for (img in projects.projects[project].images) {
                var formattedProjectImage = HTMLprojectImage.replace("%data%", projects.projects[project].images[img]);
                $(".project-entry:last").append(formattedProjectImage);
            }
        }


    }
}

work.display = function() {
    for (job in work.jobs) {
        $("#workExperience").append(HTMLworkStart);

        var formattedEmployer = HTMLworkEmployer.replace("%data%", work.jobs[job].employer);
        var formattedTitle = HTMLworkTitle.replace("%data%", work.jobs[job].title);
        var formattedStart = HTMLworkDates.replace("%data%", work.jobs[job].date_started + " - " + work.jobs[job].date_ended);
        var formattedEmployerTitle = formattedEmployer + " " + formattedTitle;
        var formattedDescription = HTMLworkDescription.replace("%data%", work.jobs[job].description);
        var formattedLocation = HTMLworkLocation.replace("%data%", work.jobs[job].location)

        $(".work-entry:last").append(formattedEmployerTitle);
        $(".work-entry:last").append(formattedStart);
        $(".work-entry:last").append(formattedLocation);
        $(".work-entry:last").append(formattedDescription);
    }
}

education.display = function(){
    for (school in education.schools)
        $("#education").append(HTMLschoolStart);

        var formattedSchoolNameDegree = HTMLschoolNameDegree.replace("%data%", education.schools[school].name + " -- " + education.schools[school].degree);
        if (education.schools[school].url){
            var formattedSchoolNameDegree = formattedSchoolNameDegree.replace("%URLdata%", education.schools[school].url);
        }
        else{
            var formattedSchoolNameDegree = formattedSchoolNameDegree.replace("%URLdata%", "#");
        }
        var formattedSchoolLocation = HTMLschoolLocation.replace("%data%", education.schools[school].city);
        var formattedSchoolDates = HTMLschoolDates.replace("%data%", education.schools[school].date_started + "-" + education.schools[school].date_finished);
        var formattedSchoolMajor = HTMLschoolMajor.replace("%data%", education.schools[school].major);



        $(".education-entry:last").append(formattedSchoolNameDegree);
        $(".education-entry:last").append(formattedSchoolLocation);
        $(".education-entry:last").append(formattedSchoolDates);
        $(".education-entry:last").append(formattedSchoolMajor);

    for (course in education.onlineCourses){

        //Adding the header for online courses
        if (course == 0){
            $(".education-entry:last").append(HTMLonlineHeader);
        }

        $("#education").append(HTMLonlineClasses);

        var formattedOnlineTitleSchool = HTMLonlineTitleSchool.replace("%data%", education.onlineCourses[course].name + " -- "
        + education.onlineCourses[course].school);
        if (education.onlineCourses[course].url){
            var formattedOnlineTitleSchool = formattedOnlineTitleSchool.replace("%URLdata%", education.onlineCourses[course].url);
        }
        else{
            var formattedOnlineTitleSchool = formattedOnlineTitleSchool.replace("%URLdata%", "#");
        }
        var formattedOnlineDates = HTMLonlineDates.replace("%data%", education.onlineCourses[course].date_started + " - "
        + education.onlineCourses[course].date_finished);

        $(".education-entry:last").append(formattedOnlineTitleSchool);
        $(".education-entry:last").append(formattedOnlineDates);
    }
}

bio.display = function(){
    var formattedName = HTMLheaderName.replace("%data%", bio.name);
    var formattedRole = HTMLheaderRole.replace("%data%", bio.role);
    var formattedEmail = HTMLemail.replace("%data%", bio.contacts.email);
    var formattedGithub = HTMLgithub.replace("%data%", bio.contacts.github);
    var formattedLocation = HTMLlocation.replace("%data%", bio.contacts.location);

    $("#header").prepend(formattedRole);
    $("#header").prepend(formattedName);


    if (bio.skills.length > 0) {
        $("#header").append(HTMLskillsStart);

        for (skill in bio.skills) {
            var formattedSkill = HTMLskills.replace("%data%", bio.skills[skill]);
            $("#skills").append(formattedSkill);
        }
    }

    $("#header").append(formattedEmail + formattedLocation + formattedGithub);
    $("#lets-connect").append(formattedEmail + formattedLocation + formattedGithub)
}


//Functional Code



$("#main").append(work.position);
$("#main").append(education.schools);
$("#mapDiv").append(googleMap);

bio.display();
education.display();
work.display();
projects.display();

