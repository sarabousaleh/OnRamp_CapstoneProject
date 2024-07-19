import React, { useState } from 'react';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import CollapsibleContainer from '../../components/CollapsibleContainer/CollapsibleContainer';
import './LibraryPage.css';
import TipsComponent from '../../components/TipsComponents/TipsComponent';
import RecommendedReading from '../../components/Readings/Readings';
const LibraryPage = () => {
  const recommendedReadings = [
    {
      title: 'Burnout: The Secret to Unlocking the Stress Cycle',
      author: 'Amelia Nagoski',
      imageUrl:
        'https://m.media-amazon.com/images/I/71zXJffIQUL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'Maybe You Should Talk to Someone',
      author: 'Lori Gottlieb',
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1547189796i/37570546.jpg'
    },
    {
      title: 'Stop Overthinking',
      author: 'Nick Trenton',
      imageUrl:
        'https://m.media-amazon.com/images/I/71k9zlFpoDL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'Why Has Nobody Told Me This Before?',
      author: 'Dr. Julie Smith',
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1670001084i/58536046.jpg'
    },
    {
      title: 'Emotional First Aid',
      author: 'Guy Winch',
      imageUrl:
        'https://m.media-amazon.com/images/I/61h-3nb9YvL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'An Unquiet Mind',
      author: 'Kay Redfield Jamison',
      imageUrl:
        'https://m.media-amazon.com/images/I/51W9qy4X0NL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'The 7 Habits of Highly Effective People',
      author: 'Stephen Covey',
      imageUrl:
        'https://m.media-amazon.com/images/I/71Koyhv2bML._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'Set Boundaries, Find Peace',
      author: 'Nedra Glover Tawwab',
      imageUrl: 'https://images.penguinrandomhouse.com/cover/9780593192092'
    },
    {
      title: 'Happy Days',
      author: 'Gabrielle Bernstein',
      imageUrl:
        'https://m.media-amazon.com/images/I/41iZwH8ciML._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'The Body Keeps Score',
      author: 'Bessel van der Kolk',
      imageUrl:
        'https://m.media-amazon.com/images/I/71Ha3OShqSL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'Tiny Beautiful Things: Advice on Love and Life from Dear Sugar',
      author: 'Cheryl Strayed',
      imageUrl:
        'https://m.media-amazon.com/images/I/51HDNk0YUmL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'When Things Fall Apart',
      author: 'Pema Chödrön',
      imageUrl:
        'https://m.media-amazon.com/images/I/91naQhS6F3L._AC_UF1000,1000_QL80_.jpg'
    }
  ];

  const disorders = [
    {
      name: 'Depression',
      symptoms:
        'Persistent sadness, loss of interest in activities, changes in appetite and sleep, fatigue, feelings of worthlessness, difficulty concentrating.',
      treatment:
        'Therapy (e.g., cognitive-behavioral therapy), medication (antidepressants), lifestyle changes, and support groups.',
      video: 'https://www.youtube.com/embed/z-IR48Mb3W0?si=az14FB8IycfvlRlB'
    },
    {
      name: 'Anxiety Disorders',
      symptoms:
        'Generalized Anxiety Disorder (GAD): Excessive worry about various aspects of life. Panic Disorder: Recurrent panic attacks with intense fear and physical symptoms. Social Anxiety Disorder: Fear of social situations and being judged by others.',
      treatment:
        'Therapy (e.g., cognitive-behavioral therapy), medication (anti-anxiety medications, antidepressants), relaxation techniques, and lifestyle changes.',
      video: 'https://www.youtube.com/embed/vtUdHOx494E?si=XHAPOoJ2ZubfERX9'
    },

    {
      name: 'Bipolar Disorder',
      symptoms:
        'Extreme mood swings with episodes of mania (elevated mood, increased energy, impulsive behavior) and depression (low mood, fatigue, hopelessness).',
      treatment:
        'Medication (mood stabilizers, antipsychotics, antidepressants), therapy, lifestyle changes, and support groups.',
      video: 'https://www.youtube.com/embed/RrWBhVlD1H8?si=Xx0Hjty8T_ccQQOO'
    },
    {
      name: 'Schizophrenia',
      symptoms:
        'Delusions, hallucinations, disorganized thinking, lack of motivation, social withdrawal, and cognitive difficulties.',
      treatment:
        'Medication (antipsychotics), therapy (e.g., cognitive-behavioral therapy), social support, and rehabilitation programs.',
      video: 'https://www.youtube.com/embed/K2sc_ck5BZU?si=05JUlRj8-njYGy5k'
    },
    {
      name: 'Obsessive-Compulsive Disorder (OCD)',
      symptoms:
        'Obsessions (intrusive, unwanted thoughts) and compulsions (repetitive behaviors or mental acts to reduce anxiety).',
      treatment:
        'Therapy (e.g., cognitive-behavioral therapy with exposure and response prevention), medication (antidepressants), and support groups.',
      video: 'https://www.youtube.com/embed/-Zg6PEJHRoo?si=OMaKhCz77zGUUzP8'
    },
    {
      name: 'Post-Traumatic Stress Disorder (PTSD)',
      symptoms:
        'Re-experiencing traumatic events through flashbacks or nightmares, avoidance of reminders, hyperarousal (e.g., being easily startled), negative changes in mood and thoughts.',
      treatment:
        'Therapy (e.g., cognitive-behavioral therapy, EMDR), medication (antidepressants, anti-anxiety medications), and support groups.',
      video: 'https://www.youtube.com/embed/aAvZPaDlwR0?si=xZf76mpXcwtnE0Ke'
    },
    {
      name: 'Eating Disorders',
      symptoms:
        'Anorexia Nervosa: Restriction of food intake leading to low body weight, intense fear of gaining weight, and distorted body image. Bulimia Nervosa: Binge eating followed by compensatory behaviors like vomiting or excessive exercise. Binge Eating Disorder: Recurrent episodes of eating large quantities of food without compensatory behaviors.',
      treatment:
        'Therapy (e.g., cognitive-behavioral therapy), nutritional counseling, medication, and support groups.',
      video: 'https://www.youtube.com/embed/3Bax8ijH038?si=fXzXukVH_Og_F299'
    },
    {
      name: 'Attention-Deficit/Hyperactivity Disorder (ADHD)',
      symptoms:
        'Inattention, hyperactivity, impulsivity that interferes with functioning or development.',
      treatment:
        'Medication (stimulants, non-stimulants), therapy (behavioral therapy), lifestyle changes, and support for academic or occupational challenges.',
      video: 'https://www.youtube.com/embed/ymDJl6Yv5Ss?si=badG9XAdkTAr67Ga'
    },
    {
      name: 'Borderline Personality Disorder (BPD)',
      symptoms:
        'Intense fear of abandonment, unstable relationships, impulsive behavior, self-harm, mood swings, chronic feelings of emptiness.',
      treatment:
        'Therapy (e.g., dialectical behavior therapy), medication (mood stabilizers, antidepressants), and support groups.',
      video: 'https://www.youtube.com/embed/KSPhc2NJA2Q?si=rT0ytIj_hDphvoxW'
    }
  ];

  const [selectedDisorder, setSelectedDisorder] = useState(null);

  const handleDisorderClick = (disorder) => {
    setSelectedDisorder(disorder);
  };

  return (
    <>
      <ArrowHeader title="Your Library" />
      <CollapsibleContainer title="Common Mental Health Disorders">
        <div>
          {disorders.map((disorder, index) => (
            <button
              className="disorder-button"
              key={index}
              onClick={() => handleDisorderClick(disorder)}
            >
              {disorder.name}
            </button>
          ))}
        </div>

        {selectedDisorder && (
          <div className="disorder-details">
            <h2 className="h2-detail">{selectedDisorder.name}:</h2>
            <p>
              <strong>Symptoms:</strong> {selectedDisorder.symptoms}
            </p>
            <p>
              <strong>Treatment:</strong> {selectedDisorder.treatment}
            </p>
            <div className="video-container">
              <iframe
                width="560"
                height="315"
                src={selectedDisorder.video}
                title={`YouTube video about ${selectedDisorder.name}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </CollapsibleContainer>

      <CollapsibleContainer title="Tips for Mental Health Well Being">
        <TipsComponent
          title="1. Practice Mindfulness and Meditation"
          tips={[
            'Spend a few minutes each day focusing on your breath and being present in the moment.',
            'Try guided meditation apps like Headspace or Calm.',
            'Engage in mindful walking or nature meditation for added relaxation.',
            "Practice gratitude meditation by focusing on things you're thankful for."
          ]}
          photoUrl="https://i.pinimg.com/564x/54/4a/3e/544a3e173acd4a80806eba8e4551fafe.jpg"
        />

        <TipsComponent
          title="2. Stay Connected"
          tips={[
            'Reach out to friends and family regularly.',
            'Participate in community or support groups.',
            "Arrange regular video calls with loved ones if in-person meetings aren't possible.",
            'Join online forums or social media groups focused on shared interests for additional support.'
          ]}
          photoUrl="https://i.pinimg.com/564x/c7/09/41/c7094182e6003eddd44afa3dc46c55df.jpg"
        />

        <TipsComponent
          title="3. Limit Stress"
          tips={[
            'Identify stress triggers and develop coping strategies.',
            'Practice relaxation techniques such as deep breathing, progressive muscle relaxation, or yoga.',
            'Consider setting boundaries to reduce exposure to stressors.',
            'Take regular breaks during work or study sessions to prevent burnout.'
          ]}
          photoUrl="https://i.pinimg.com/564x/4b/09/df/4b09dfab8c969a055d4c2aebd7923f37.jpg"
        />

        <TipsComponent
          title="4. Get Regular Exercise"
          tips={[
            'Physical activity can help reduce stress and improve mood.',
            'Aim for at least 30 minutes of moderate exercise most days.',
            'Consider incorporating activities like yoga or tai chi for both physical and mental health benefits.',
            'Find enjoyable ways to stay active, such as dancing, hiking, or playing sports with friends.'
          ]}
          photoUrl="https://i.pinimg.com/564x/0c/7f/df/0c7fdf13405fbf376f1ac22c93047a88.jpg"
        />

        <TipsComponent
          title="5. Maintain a Healthy Diet"
          tips={[
            'Eat balanced meals with plenty of fruits, vegetables, lean proteins, and whole grains.',
            'Limit caffeine and sugar intake.',
            'Stay hydrated by drinking plenty of water throughout the day.',
            'Include omega-3 fatty acids found in fish, nuts, and seeds for brain health.'
          ]}
          photoUrl="https://i.pinimg.com/564x/88/52/94/885294ec3852f863b97856a590db8183.jpg"
        />

        <TipsComponent
          title="6. Get Enough Sleep"
          tips={[
            'Establish a regular sleep schedule.',
            'Create a calming bedtime routine and make your sleep environment comfortable.',
            'Avoid electronic devices before bedtime to improve sleep quality.',
            'Consider using white noise machines or earplugs to block out distractions.'
          ]}
          photoUrl="https://i.pinimg.com/564x/7a/50/ea/7a50ea3c3d27c288b1cf7e11416202b0.jpg"
        />

        <TipsComponent
          title="7. Set Realistic Goals"
          tips={[
            'Break tasks into smaller steps and set achievable goals.',
            'Celebrate your progress and accomplishments.',
            'Regularly review and adjust your goals based on your current priorities and circumstances.',
            'Seek feedback and support from others to help you stay accountable.'
          ]}
          photoUrl="https://i.pinimg.com/564x/e1/31/5c/e1315c67dcef1816b529c39246f77383.jpg"
        />

        <TipsComponent
          title="8. Take Breaks and Rest"
          tips={[
            'Allow yourself time to relax and recharge.',
            'Practice self-compassion and avoid overloading yourself with tasks.',
            'Engage in hobbies or activities that you find enjoyable and fulfilling.',
            'Set boundaries to protect your time and energy from excessive demands.'
          ]}
          photoUrl="https://i.pinimg.com/564x/02/fe/56/02fe566198b22fcea70800144c08278a.jpg"
        />

        <TipsComponent
          title="9. Engage in Activities You Enjoy"
          tips={[
            'Dedicate time to hobbies and activities that bring you joy.',
            'Explore new interests and creative outlets.',
            'Connect with nature by spending time outdoors or engaging in outdoor activities.',
            'Find opportunities for socializing and building connections with others who share your interests.'
          ]}
          photoUrl="https://i.pinimg.com/564x/97/2e/9f/972e9fb664823be5292675d5f285e49b.jpg"
        />

        <TipsComponent
          title="10. Seek Professional Help When Needed"
          tips={[
            'Don’t hesitate to reach out to a mental health professional if you’re struggling.',
            'Use resources like therapy, counseling, or support hotlines.',
            'Consider joining a support group or attending therapy sessions to connect with others who may be experiencing similar challenges.',
            'Research different treatment options and providers to find the best fit for your needs.'
          ]}
          photoUrl="https://i.pinimg.com/736x/f0/28/a4/f028a41fd2e97e2a9d7be3a2756e84fd.jpg"
        />

        <TipsComponent
          title="11. Stay Informed"
          tips={[
            'Educate yourself about mental health and well-being.',
            'Read articles, watch videos, or listen to podcasts on mental health topics.',
            'Stay updated on the latest research and developments in mental health treatment and support.',
            'Engage in discussions with friends, family, or professionals to deepen your understanding of mental health issues.'
          ]}
          photoUrl="https://i.pinimg.com/564x/f0/ba/ce/f0bace1a1e14c7cd5b135e7055ef0828.jpg"
        />

        <TipsComponent
          title="12. Practice Gratitude"
          tips={[
            'Keep a journal to note things you are grateful for each day.',
            'Reflect on positive experiences and moments.',
            'Express gratitude to others through acts of kindness or words of appreciation.',
            'Cultivate a mindset of gratitude by focusing on the present moment and acknowledging the good things in your life.'
          ]}
          photoUrl="https://i.pinimg.com/564x/29/0e/f1/290ef1d8da9b2ea17632e19b8e5d5bd4.jpg"
        />
      </CollapsibleContainer>

      <CollapsibleContainer title="Some videos to know more and improve your mental health">
        <p>
          These videos can help you to manage your mental health, and learn more
          about it! each channel has many videos that we recommend you watch for
          more information.
        </p>
        <div className="two-video-container">
          <iframe
            width="400"
            height="280"
            src="https://www.youtube.com/embed/rkZl2gsLUp4?si=PhOWQ-aVl55MhXKV"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          <iframe
            width="400"
            height="280"
            src="https://www.youtube.com/embed/LnJwH_PZXnM?si=83GdSImECw24ap4L"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
        <div className="two-video-container">
          <iframe
            width="400"
            height="280"
            src="https://www.youtube.com/embed/qN8fzqw1WAk?si=AJ1G9RNSYq-SwEuL"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
          <iframe
            width="400"
            height="280"
            src="https://www.youtube.com/embed/gHHTeycXcFg?si=5xKqGnFDtjLLCkhR"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </CollapsibleContainer>

      <CollapsibleContainer title="Recommended Readings">
        <div className="recommended-readings-container">
          {recommendedReadings.map((reading, index) => (
            <RecommendedReading
              key={index}
              title={reading.title}
              author={reading.author}
              imageUrl={reading.imageUrl}
            />
          ))}
        </div>
      </CollapsibleContainer>
    </>
  );
};

export default LibraryPage;
