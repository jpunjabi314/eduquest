import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'lib/client/firebase';
import { FC, useState } from 'react';
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

const ClassPage: FC = () => {
  const [user, loading] = useAuthState(firebase.auth());
  const [pointsToGive, setPointsToGive] = useState('');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemedCard, setRedeemedCard] = useState<GiftCard>(null);

  const router = useRouter();
  const { token } = router.query;

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const classroom = useAuthedData<{
    relation: 'student' | 'teacher';
    data: Classroom | SensoredClassroom;
  }>(`/api/classrooms/get/${token}`, user);

  if (classroom.data) {
    if (classroom.data.relation === 'teacher') {
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

          <div className="student-list">
            {(classroom.data.data as Classroom).complex.map((student) => (
              <Card
                title={student.name}
                subtitle={`${student.points}/500 points`}
                children={
                  <>
                    <Button bg="background-light" onClick={() => addPoints(1, student.uid)}>
                      Quick add 1 point
                    </Button>
                    <br />
                    <Input
                      id="points"
                      label="Points to add"
                      value={pointsToGive}
                      onChange={(value) => setPointsToGive(value.target.value)}
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

          if (kind === 'Sweatshirt') {
            // Handle special redemption
            // Perform actions specific to 'Sweatshirt' kind
          } else if (kind === 'Taco Bell') {
            // Handle regular redemption
            // Perform actions specific to 'Taco Bell' kind
          } else {
            // Handle other kinds
            // Perform actions for all other kinds
          }

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