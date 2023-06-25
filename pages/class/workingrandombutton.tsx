import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'lib/client/firebase';
import { FC, useState, useEffect } from 'react';
import Container from 'components/container';
import Card from 'components/card';
import { useRouter } from 'next/router';
import { useAuthedData } from 'lib/client/hooks';
import { Classroom, GiftCard, SensoredClassroom } from 'lib/isomorphic/types';
import { FullscreenLoader } from 'components/loader';
import Button from 'components/button';
import { authedDataFetcher } from 'lib/client/helpers';
import Input from 'components/input';
import Modal from 'components/modal';
import { format } from 'date-fns';
import Drop from 'components/drop';
import Randomwinner from 'components/randomwinner';
import { saveAs } from 'file-saver';
/*import { generateReport } from 'lib/reportgenerator';*/
import { PDFDocument, StandardFonts } from 'pdf-lib';



interface PointOption {
  label: string;
  value: number;
}

const pointOptions: PointOption[] = [
  { label: 'Got a 100 on a test', value: 10 },
  { label: 'Participated in the Science Fair', value: 40 },
  { label: 'Did an FBLA Competitive Event', value: 50 },
  { label: 'Participated in the Cultural Festival', value: 10 },
  { label: 'Achieved honor roll', value: 50 },
  { label: 'Attended a football game', value: 5 },
  { label: 'Participated in the FBLA Dodgeball Tournament', value: 10 },
  { label: 'Won a sports medal', value: 60 },
  { label: 'Attended swimming gala', value: 10 },
  { label: 'Participated in Volleyball-A-Thon', value: 10 },
];


export async function generateReport(classroomData: Classroom | SensoredClassroom, points: number) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a new page to the document
  const page = pdfDoc.addPage();

  // Get the default font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Create a string variable to hold the report content
  let reportContent = '';

  // Add the classroom name to the report
  reportContent += `Report for ${classroomData.name}\n\n`;

  // Add information specific to each type of classroom
  if ('complex' in classroomData) {
    // Classroom type
    reportContent += 'Students:\n';
    classroomData.complex.forEach((student) => {
      reportContent += `- ${student.name} - Points: ${student.points}\n`;
    });
  } else {
    // SensoredClassroom type
    reportContent += 'Owner Name: ' + classroomData.owner.name + '\n';
    reportContent += 'Points: ' + points + '\n';
  }

  const currentDate = new Date();
  // Get the current date and time
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const formattedDateTime = `Report Generated on: ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // Draw the report content on the page
  const textSize = 12;
  const margin = 50;
  let textY = page.getHeight() - margin;

  page.drawText(reportContent, {
    x: margin,
    y: textY,
    size: textSize,
    font: font,
    lineHeight: textSize * 1.2,
  });

  // Calculate the height of the formattedDateTime text
  const formattedDateTimeHeight = font.heightAtSize(textSize);

  // Adjust the y-coordinate to move the formattedDateTime to the bottom
  textY = margin + formattedDateTimeHeight;

  // Draw the formattedDateTime at the bottom of the page
  page.drawText(formattedDateTime, {
    x: margin,
    y: textY,
    size: textSize,
    font: font,
    lineHeight: textSize * 1.2,
  });

  // Serialize the PDF document to bytes
  const pdfBytes = await pdfDoc.save();

  // Create a Blob from the PDF bytes
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  // Save the Blob as a file
  saveAs(blob, 'report.pdf');
}

const ClassPage: FC = () => {
  const [user, loading] = useAuthState(firebase.auth());
  const [pointsToGive, setPointsToGive] = useState('');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemedCard, setRedeemedCard] = useState<GiftCard>(null);

  const router = useRouter();
  const { token } = router.query;

  const classroom = useAuthedData<{
    relation: 'student' | 'teacher';
    data: Classroom | SensoredClassroom;
  }>(`/api/classrooms/get/${token}`, user);

  const [selectedOption, setSelectedOption] = useState('');

  const [participants, setParticipants] = useState<string[]>([]);

  const fetchParticipants = async () => {
    try {
      const participantsSnapshot = await firebase
        .database()
        .ref(`classrooms/${classroom.data.data.id}/complex`)
        .once('value');
      const participantsData = participantsSnapshot.val();
      const participantsArray = participantsData ? Object.values(participantsData) as string[] : [];
      setParticipants(participantsArray);
    } catch (error) {
      console.log('Error fetching participants:', error);
    }
  };

  useEffect(() => {
    if (classroom.data) {
      fetchParticipants();
    }
  }, [classroom.data]);

  const handleGenerateReport = () => {
    // Get the points from classroom data
    (classroom.data.data as Classroom).complex.map((student) => {
      const studentPoints = student.points;
      generateReport(classroom.data.data, studentPoints);
      // Do something with the studentPoints value
    });
    
  };
  
  if (classroom.data) {
    

    if (classroom.data.relation === 'teacher') {
      const participants = (classroom.data.data as Classroom).complex.map((student) => student.name);
      const addPoints = async (points: number, member: string) => {
        if (points) {
          await authedDataFetcher('/api/points/update', user, {
            token: classroom.data.data.id,
            points,
            member: member,
          });
          classroom.revalidate();
        }
      };

      return (
        <Container>
          <h1>{classroom.data.data.name}</h1>
          <p>Invite more students: {classroom.data.data.id}</p>
          <Randomwinner
            participants={participants}
            fontSize="md"
            fontWeight={500}
            m={{ t: 2, r: 4, b: 2, l: 4 }}
            p={{ t: 6, r: 12, b: 6, l: 12 }}
          >
            Choose Random Winner!
          </Randomwinner>
          <Button onClick={handleGenerateReport}>Generate Report</Button>

          <br />
          <br />

          <div className="student-list">
            {(classroom.data.data as Classroom).complex.map((student) => (
              <Card
                key={student.uid}
                title={student.name}
                subtitle={`${student.points}/500 points`}
                children={
                  <>
                    <Button bg="background-light" onClick={() => addPoints(1, student.uid)}>
                      Quick add 1 point
                    </Button>
                    <br />

                    <label htmlFor="points">Choose Points:</label>
                    <Drop
                      items={[
                        { label: 'Select Points' },
                        ...pointOptions.map((option) => ({
                          label: `${option.label} (${option.value} pts)`,
                          value: option.value,
                        })),
                      ]}
                      onSelect={(item) => setSelectedOption(item.value)} // Update function name to setSelectedOption
                    />

                    <Button
                      bg="background-light"
                      onClick={() => addPoints(parseInt(selectedOption), student.uid)}
                      m={{ y: 6 }}
                    >
                      Add Pre-Set Points
                    </Button>

                    <br />
                    <Input
                      id="points"
                      label="Points to add"
                      value={pointsToGive}
                      onChange={(event) => setPointsToGive(event.target.value)}
                      border={true}
                    />
                    <Button
                      bg="background-light"
                      onClick={() => addPoints(parseInt(pointsToGive), student.uid)}
                      m={{ y: 6 }}
                    >
                      Add custom points
                    </Button>
                  </>
                }
              />
            ))}
          </div>

          <style jsx>{`
            .student-list {
              display: grid;
              gap: 16px;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            }
          `}</style>
        </Container>
      );
    } else {
      const redeemPoints = async (kind: string) => {
        try {
          const card = await authedDataFetcher('/api/redeem', user, {
            token: classroom.data.data.id,
            kind,
          });
          setRedeemedCard(card);
          classroom.revalidate();
        } catch (error) {
          console.log('error!');
        }
      };

      return (
        <Container>
          <h1>{classroom.data.data.name}</h1>
          <h3>{classroom.data.data.owner.name}</h3>

          <p>You have {(classroom.data.data as SensoredClassroom).points}/500 points</p>
          {(classroom.data.data as SensoredClassroom).points >= 500 ? (
            <>
              <Button bg="background-light" fg="accent" m={{ y: 16 }} onClick={() => setShowRedeemModal(true)}>
                Redeem points...
              </Button>
            </>
          ) : (
            <p>
              {[
                'Keep working at it!',
                "Don't worry, you'll get there",
                'You can do this!',
              ][Math.floor(Math.random() * 3)]}
            </p>
          )}

          <Modal
            title="Redeem for a prize!"
            visible={showRedeemModal}
            controls={''}
            setVisible={() => setShowRedeemModal(false)}
          >
            {redeemedCard ? (
              <>
                <p>Your prize info is:</p>
                {redeemedCard.kind === 'School Store' && (
                  <>
                    <ul>
                      <li>Card Number: {redeemedCard.card}</li>
                      <li>Type of Card: School Store Gift Card</li>
                      <li>No expiration date</li>
                    </ul>
                    <p>***Print this page out and present at school store***</p>
                    <Button onClick={() => window.print()}>Print Page</Button>
                  </>
                )}
                {redeemedCard.kind === 'Taco Bell' && (
                  /* Content specific to 'School Store' kind */
                  <>
                    <ul>
                      <li>Card Number: {redeemedCard.card}</li>
                      <li>Pin Number: {redeemedCard.pin}</li>
                      <li>Type of Card: {redeemedCard.kind}</li>
                      <li>No expiration date</li>
                      <li>Redeemable at ALL Taco Bell restaurants</li>
                    </ul>
                    <p>***Take a screenshot of this for your records***</p>
                    <Button onClick={() => window.print()}>Print Page</Button>
                  </>
                )}
                {redeemedCard.kind === 'Sweatshirt' && (
                  <>
                    <ul>
                      <li>Verification Code: {redeemedCard.pin}</li>
                      <li>Type of Prize: Sweatshirt</li>
                      <li>Expiration Date: {format(new Date().setHours(23, 59, 59, 999), 'MMM dd, yyyy HH:mm:ss')}</li>
                    </ul>
                    <p>***Print this page out & present to school store by end of day!***</p>
                    <Button onClick={() => window.print()}>Print Page</Button>
                  </>
                )}
              </>
            ) : (
              <>
                <p>Your options are:</p>
                <div>
                  <Button onClick={() => redeemPoints('School Store')}>School Store Gift Card (500 pts)</Button>
                  <Button onClick={() => redeemPoints('Taco Bell')}>Taco Bell Gift Card (1000 pts)</Button>
                  <Button onClick={() => redeemPoints('Sweatshirt')}>Sweatshirt (1500 pts)</Button>
                </div>
                <small>disclaimer (for gift cards): card numbers are for demonstration purposes only & are not redeemable</small>
              </>
            )}
          </Modal>
        </Container>
      );
    }
  } else if (classroom.error) {
    router.push('/');
    return <></>;
  } else {
    return <FullscreenLoader />;
  }
};

export default ClassPage;