import React from 'react';
import ArrowHeader from '../../components/ArrowHeader/ArrowHeader';
import CollapsibleContainer from '../../components/CollapsibleContainer/CollapsibleContainer';
import './LibraryPage.css';

const LibraryPage = () => {
    const recommendedReadings = [
        {
            title: 'Burnout: The Secret to Unlocking the Stress Cycle',
            author: 'Amelia Nagoski'
        },
        {
            title: 'Maybe You Should Talk to Someone',
            author: 'Lori Gottlieb'
        },
        {
            title: 'Stop Overthinking: 23 Techniques to Relieve Stress, Stop Negative Spirals, Declutter Your Mind, and Focus on the Present',
            author: 'Nick Trenton'
        },
        {
            title: 'Why Has Nobody Told Me This Before?',
            author: 'Dr. Julie Smith'
        },
        {
            title: 'Emotional First Aid: Practical Strategies for Treating Failure, Rejection, Guilt, and Other Everyday Psychological Injuries',
            author: 'Guy Winch'
        },
        {
            title: 'An Unquiet Mind',
            author: 'Kay Redfield Jamison'
        },
        {
            title: 'The 7 Habits of Highly Effective People',
            author: 'Stephen Covey'
        },
        {
            title: 'Set Boundaries, Find Peace: A Guide to Reclaiming Yourself',
            author: 'Nedra Glover Tawwab'
        },
        {
            title: 'Happy Days: The Guided Path from Trauma to Profound Freedom and Inner Peace',
            author: 'Gabrielle Bernstein'
        }
    ];
    return (
        <>
            <ArrowHeader title="Your Library" />
            <CollapsibleContainer title="Common Mental Health Disorders">
                <h2 className='h2-detail'>Depression:</h2>
                <p>Symptoms: Persistent sadness, loss of interest in activities, changes in appetite and sleep, fatigue, feelings of worthlessness, difficulty concentrating.</p>
                <p>Treatment: Therapy (e.g., cognitive-behavioral therapy), medication (antidepressants), lifestyle changes, and support groups.</p>
                <div className="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/z-IR48Mb3W0?si=az14FB8IycfvlRlB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div><br />
                
                <h2 className='h2-detail'>Anxiety Disorders:</h2>
                <p>Generalized Anxiety Disorder (GAD): Excessive worry about various aspects of life.</p>
                <p>Panic Disorder: Recurrent panic attacks with intense fear and physical symptoms.</p>
                <p>Social Anxiety Disorder: Fear of social situations and being judged by others.</p>
                <p>Treatment: Therapy (e.g., cognitive-behavioral therapy), medication (anti-anxiety medications, antidepressants), relaxation techniques, and lifestyle changes.</p>
                <div className="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/vtUdHOx494E?si=XHAPOoJ2ZubfERX9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div><br />

                <h2 className='h2-detail'>Bipolar Disorder:</h2>
                <p>Symptoms: Extreme mood swings with episodes of mania (elevated mood, increased energy, impulsive behavior) and depression (low mood, fatigue, hopelessness).</p>
                <p>Treatment: Medication (mood stabilizers, antipsychotics, antidepressants), therapy, lifestyle changes, and support groups.</p>
                <div className="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/RrWBhVlD1H8?si=Xx0Hjty8T_ccQQOO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div><br />

                <h2 className='h2-detail'>Schizophrenia:</h2>
                <p>Symptoms: Delusions, hallucinations, disorganized thinking, lack of motivation, social withdrawal, and cognitive difficulties.</p>
                <p>Treatment: Medication (antipsychotics), therapy (e.g., cognitive-behavioral therapy), social support, and rehabilitation programs.</p>
                <div className="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/K2sc_ck5BZU?si=05JUlRj8-njYGy5k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div><br />

                <h2 className='h2-detail'>Obsessive-Compulsive Disorder (OCD):</h2>
                <p>Symptoms: Obsessions (intrusive, unwanted thoughts) and compulsions (repetitive behaviors or mental acts to reduce anxiety).</p>
                <p>Treatment: Therapy (e.g., cognitive-behavioral therapy with exposure and response prevention), medication (antidepressants), and support groups.</p>
                <div className="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/-Zg6PEJHRoo?si=OMaKhCz77zGUUzP8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div><br />

                <h2 className='h2-detail'>Post-Traumatic Stress Disorder (PTSD):</h2>
                <p>Symptoms: Re-experiencing traumatic events through flashbacks or nightmares, avoidance of reminders, hyperarousal (e.g., being easily startled), negative changes in mood and thoughts.</p>
                <p>Treatment: Therapy (e.g., cognitive-behavioral therapy, EMDR), medication (antidepressants, anti-anxiety medications), and support groups.</p>
                <div className="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/aAvZPaDlwR0?si=xZf76mpXcwtnE0Ke" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div><br />

                <h2 className='h2-detail'>Eating Disorders:</h2>
                <p>Anorexia Nervosa: Restriction of food intake leading to low body weight, intense fear of gaining weight, and distorted body image.</p>
                <p>Bulimia Nervosa: Binge eating followed by compensatory behaviors like vomiting or excessive exercise.</p>
                <p>Binge Eating Disorder: Recurrent episodes of eating large quantities of food without compensatory behaviors.</p>
                <p>Treatment: Therapy (e.g., cognitive-behavioral therapy), nutritional counseling, medication, and support groups.</p>
                <div className="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/3Bax8ijH038?si=fXzXukVH_Og_F299" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
               </div><br />

                <h2 className='h2-detail'>Attention-Deficit/Hyperactivity Disorder (ADHD):</h2>
                <p>Symptoms: Inattention, hyperactivity, impulsivity that interferes with functioning or development.</p>
                <p>Treatment: Medication (stimulants, non-stimulants), therapy (behavioral therapy), lifestyle changes, and support for academic or occupational challenges.</p>
                <div className="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/ymDJl6Yv5Ss?si=badG9XAdkTAr67Ga" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div><br />

                <h2 className='h2-detail'>Borderline Personality Disorder (BPD):</h2>
                <p>Symptoms: Intense fear of abandonment, unstable relationships, impulsive behavior, self-harm, mood swings, chronic feelings of emptiness.</p>
                <p>Treatment: Therapy (e.g., dialectical behavior therapy), medication (mood stabilizers, antidepressants), and support groups.</p>
                <div className="video-container">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/KSPhc2NJA2Q?si=rT0ytIj_hDphvoxW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div><br />

            </CollapsibleContainer>
            
            <CollapsibleContainer title="Tips for Mental Health Well Being">
            <div class="dual-container">
                <div class="text-container">
                    <h2 className='h2-detail'>1. Practice Mindfulness and Meditation:</h2>
                    <ul>
                        <li><p>Spend a few minutes each day focusing on your breath and being present in the moment.</p></li>
                        <li><p>Try guided meditation apps like Headspace or Calm.</p></li>
                        <li><p>Engage in mindful walking or nature meditation for added relaxation.</p></li>
                        <li><p>Practice gratitude meditation by focusing on things you're thankful for.</p></li>
                    </ul>
                </div>
                <div className="photo-container">
                    <img src="https://i.pinimg.com/564x/54/4a/3e/544a3e173acd4a80806eba8e4551fafe.jpg" alt="" />
                </div>
            </div>

            <div class="dual-container">
                <div class="text-container">
                    <h2 className='h2-detail'>2. Stay Connected:</h2>
                    <ul>
                        <li><p>Reach out to friends and family regularly.</p></li>
                        <li><p>Participate in community or support groups.</p></li>
                        <li><p>Arrange regular video calls with loved ones if in-person meetings aren't possible.</p></li>
                        <li><p>Join online forums or social media groups focused on shared interests for additional support.</p></li>
                    </ul>
                </div>
                <div className="photo-container">
                    <img src="https://i.pinimg.com/564x/c7/09/41/c7094182e6003eddd44afa3dc46c55df.jpg" alt="" />
                </div>
            </div>

                <div class="dual-container">
                    <div class="text-container">
                        <h2 className='h2-detail'>3. Limit Stress:</h2>
                        <ul>
                            <li><p>Identify stress triggers and develop coping strategies.</p></li>
                            <li><p>Practice relaxation techniques such as deep breathing, progressive muscle relaxation, or yoga.</p></li>
                            <li><p>Consider setting boundaries to reduce exposure to stressors.</p></li>
                            <li><p>Take regular breaks during work or study sessions to prevent burnout.</p></li>
                        </ul>
                    </div>
                    <div className="photo-container">
                        <img src="https://i.pinimg.com/564x/4b/09/df/4b09dfab8c969a055d4c2aebd7923f37.jpg" alt="" />
                    </div>
                </div>

                <div class="dual-container">
                    <div class="text-container">
                        <h2 className='h2-detail'>4. Get Regular Exercise:</h2>
                        <ul>
                            <li><p>Physical activity can help reduce stress and improve mood.</p></li>
                            <li><p>Aim for at least 30 minutes of moderate exercise most days.</p></li>
                            <li><p>Consider incorporating activities like yoga or tai chi for both physical and mental health benefits.</p></li>
                            <li><p>Find enjoyable ways to stay active, such as dancing, hiking, or playing sports with friends.</p></li>
                        </ul>
                        </div>
                    <div className="photo-container">
                        <img src="https://i.pinimg.com/564x/0c/7f/df/0c7fdf13405fbf376f1ac22c93047a88.jpg" alt="" />
                    </div>
                </div>

                <div class="dual-container">
                    <div class="text-container">
                        <h2 className='h2-detail'>5. Maintain a Healthy Diet:</h2>
                        <ul>
                            <li><p>Eat balanced meals with plenty of fruits, vegetables, lean proteins, and whole grains.</p></li>
                            <li><p>Limit caffeine and sugar intake.</p></li>
                            <li><p>Stay hydrated by drinking plenty of water throughout the day.</p></li>
                            <li><p>Include omega-3 fatty acids found in fish, nuts, and seeds for brain health.</p></li>
                        </ul>
                    </div>
                    <div className="photo-container">
                        <img src="https://i.pinimg.com/564x/88/52/94/885294ec3852f863b97856a590db8183.jpg" alt="" />
                    </div>
                </div>
                
                
                <div class="dual-container">
                    <div class="text-container">
                        <h2 className='h2-detail'>6. Get Enough Sleep:</h2>
                        <ul>
                            <li><p>Establish a regular sleep schedule.</p></li>
                            <li><p>Create a calming bedtime routine and make your sleep environment comfortable.</p></li>
                            <li><p>Avoid electronic devices before bedtime to improve sleep quality.</p></li>
                            <li><p>Consider using white noise machines or earplugs to block out distractions.</p></li>
                        </ul>
                    </div>
                    <div className="photo-container">
                        <img src="https://i.pinimg.com/564x/7a/50/ea/7a50ea3c3d27c288b1cf7e11416202b0.jpg" alt="" />
                    </div>
                </div>
                
                <div class="dual-container">
                    <div class="text-container">
                        <h2 className='h2-detail'>7. Set Realistic Goals:</h2>
                        <ul>
                            <li><p>Break tasks into smaller steps and set achievable goals.</p></li>
                            <li><p>Celebrate your progress and accomplishments.</p></li>
                            <li><p>Regularly review and adjust your goals based on your current priorities and circumstances.</p></li>
                            <li><p>Seek feedback and support from others to help you stay accountable.</p></li>
                        </ul>
                    </div>
                    <div className="photo-container">
                        <img src="https://i.pinimg.com/564x/e1/31/5c/e1315c67dcef1816b529c39246f77383.jpg" alt="" />
                    </div>
                </div>
               
                <div class="dual-container">
                    <div class="text-container">
                        <h2 className='h2-detail'>8. Take Breaks and Rest:</h2>
                        <ul>
                            <li><p>Allow yourself time to relax and recharge.</p></li>
                            <li><p>Practice self-compassion and avoid overloading yourself with tasks.</p></li>
                            <li><p>Engage in hobbies or activities that you find enjoyable and fulfilling.</p></li>
                            <li><p>Set boundaries to protect your time and energy from excessive demands.</p></li>
                        </ul>
                    </div>
                    <div className="photo-container">
                        <img src="https://i.pinimg.com/564x/02/fe/56/02fe566198b22fcea70800144c08278a.jpg" alt="" />
                    </div>
                </div>
                
                
                <div class="dual-container">
                    <div class="text-container">
                        <h2 className='h2-detail'>9. Engage in Activities You Enjoy:</h2>
                        <ul>
                            <li><p>Dedicate time to hobbies and activities that bring you joy.</p></li>
                            <li><p>Explore new interests and creative outlets.</p> </li>
                            <li><p>Connect with nature by spending time outdoors or engaging in outdoor activities.</p></li>
                            <li><p>Find opportunities for socializing and building connections with others who share your interests.</p></li>
                        </ul>
                    </div>
                    <div className="photo-container">
                        <img src="https://i.pinimg.com/564x/97/2e/9f/972e9fb664823be5292675d5f285e49b.jpg" alt="" />
                    </div>
                </div>
               
                <div class="dual-container">
                    <div class="text-container">
                        <h2 className='h2-detail'>10. Seek Professional Help When Needed:</h2>
                        <ul>
                            <li><p>Don’t hesitate to reach out to a mental health professional if you’re struggling.</p></li>
                            <li><p>Use resources like therapy, counseling, or support hotlines.</p></li>
                            <li><p>Consider joining a support group or attending therapy sessions to connect with others who may be experiencing similar challenges.</p></li>
                            <li><p>Research different treatment options and providers to find the best fit for your needs.</p></li>
                        </ul>
                    </div>
                    <div className="photo-container">
                        <img src="https://i.pinimg.com/736x/f0/28/a4/f028a41fd2e97e2a9d7be3a2756e84fd.jpg" alt="" />
                    </div>
                </div>
               
                <div class="dual-container">
                    <div class="text-container">
                        <h2 className='h2-detail'>11. Stay Informed:</h2>
                        <ul>
                            <li><p>Educate yourself about mental health and well-being.</p></li>
                            <li><p>Read articles, watch videos, or listen to podcasts on mental health topics.</p></li>
                            <li><p>Stay updated on the latest research and developments in mental health treatment and support.</p></li>
                            <li><p>Engage in discussions with friends, family, or professionals to deepen your understanding of mental health issues.</p></li>
                        </ul>
                    </div>
                    <div className="photo-container">
                        <img src="https://i.pinimg.com/564x/f0/ba/ce/f0bace1a1e14c7cd5b135e7055ef0828.jpg" alt="" />
                    </div>
                </div>

                <div class="dual-container">
                    <div class="text-container">
                        <h2 className='h2-detail'>12. Practice Gratitude:</h2>
                        <ul>
                            <li><p>Keep a journal to note things you are grateful for each day.</p></li>
                            <li><p>Reflect on positive experiences and moments.</p></li>
                            <li><p>Express gratitude to others through acts of kindness or words of appreciation.</p></li>
                            <li><p>Cultivate a mindset of gratitude by focusing on the present moment and acknowledging the good things in your life.</p></li>
                        </ul>
                    </div>
                    <div className="photo-container">
                        <img src="https://i.pinimg.com/564x/29/0e/f1/290ef1d8da9b2ea17632e19b8e5d5bd4.jpg" alt="g" />
                    </div>
                </div>
            </CollapsibleContainer>
            <CollapsibleContainer title="Some videos to know more and improve your mental health">
                <div className="two-video-container">
                    <iframe width="400" height="280" src="https://www.youtube.com/embed/rkZl2gsLUp4?si=PhOWQ-aVl55MhXKV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    <iframe width="400" height="280" src="https://www.youtube.com/embed/LnJwH_PZXnM?si=83GdSImECw24ap4L" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                <div className="two-video-container">
                    <iframe width="400" height="280" src="https://www.youtube.com/embed/qN8fzqw1WAk?si=AJ1G9RNSYq-SwEuL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    <iframe width="400" height="280" src="https://www.youtube.com/embed/gHHTeycXcFg?si=5xKqGnFDtjLLCkhR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
            </CollapsibleContainer>
            
            <CollapsibleContainer title="Recommended Readings">
                <ul>
                    {recommendedReadings.map((book, index) => (
                        <li key={index}>
                            <strong>{book.title}</strong> by {book.author}
                        </li>
                    ))}
                </ul>
            </CollapsibleContainer>
        </>
    );
};

export default LibraryPage;