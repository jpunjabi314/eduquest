import { Classroom, SensoredClassroom } from 'lib/isomorphic/types';

export function generateReport(classroomData: Classroom | SensoredClassroom) {
  // Generate the report based on the classroom data

  // Create a string variable to hold the report content
  let reportContent = '';

  // Add the classroom name to the report
  reportContent += `Classroom Name: ${classroomData.name}\n\n`;

  // Add information specific to each type of classroom
  if ('complex' in classroomData) {
    // Classroom type
    reportContent += 'Students:\n';
    classroomData.complex.forEach((student) => {
      reportContent += `- ${student.name}\n`;
    });
  } else {
    // SensoredClassroom type
    reportContent += 'Owner Name: ' + classroomData.owner.name + '\n';
    reportContent += 'Points: ' + classroomData.points + '\n';
  }

  // Return the report content
  return reportContent;
}
