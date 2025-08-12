import React from 'react';
import { Users, Award, Target, Heart, Leaf, Globe, Shield } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Darshan Patil',
      role: 'Founder & CEO',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Third year student at MIT-AOE with a passion for agricultural technology'
    },
    {
      name: 'Team Member',
      role: 'CTO',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'AI specialist with a background in agricultural science and machine learning'
    },
    {
      name: 'Team Member',
      role: 'Head of Operations',
      image: 'https://randomuser.me/api/portraits/men/62.jpg',
      bio: 'Expert in agricultural operations and supply chain management'
    },
    {
      name: 'Team Member',
      role: 'Marketing Director',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: 'Specialist in rural marketing and farmer outreach programs'
    }
  ];

  const values = [
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Promoting sustainable farming practices that protect our environment'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive network of farmers and agricultural experts'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology to solve agricultural challenges'
    },
    {
      icon: Heart,
      title: 'Empathy',
      description: 'Understanding and addressing the real needs of farmers'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Making agricultural technology accessible to all farmers'
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Providing dependable solutions farmers can count on'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-green-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <TranslatableText>About KrishiMitra</TranslatableText>
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              <TranslatableText>
                Empowering farmers with AI-driven solutions for sustainable agriculture and better livelihoods
              </TranslatableText>
            </p>
          </div>
        </div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                <TranslatableText>Our Story</TranslatableText>
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <TranslatableText>
                    KrishiMitra was founded in 2025 with a simple mission: to make modern agricultural technology accessible to every farmer in India. Our journey began when our founder, Darshan Patil, a third-year student at MIT-AOE in Jalgaon, witnessed firsthand the challenges faced by farmers in his hometown.
                  </TranslatableText>
                </p>
                <p>
                  <TranslatableText>
                    Despite having smartphones, many farmers lacked access to critical information about plant diseases, weather patterns, and farming techniques. This information gap often led to crop failures and financial losses.
                  </TranslatableText>
                </p>
                <p>
                  <TranslatableText>
                    KrishiMitra was born to bridge this gap using artificial intelligence and machine learning. Darshan can be reached at doraemonboy288@gmail.com for any inquiries about our platform or partnership opportunities.
                  </TranslatableText>
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80" 
                alt="Farmers in field" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-16 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <TranslatableText>Our Mission & Vision</TranslatableText>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                <TranslatableText>Mission</TranslatableText>
              </h3>
              <p className="text-gray-600">
                <TranslatableText>
                  To empower farmers with accessible, AI-driven tools that improve crop yields, reduce losses, and increase profitability while promoting sustainable agricultural practices.
                </TranslatableText>
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                <TranslatableText>Vision</TranslatableText>
              </h3>
              <p className="text-gray-600">
                <TranslatableText>
                  A future where every farmer in India has access to the technology, information, and market connections needed to thrive in a changing climate and evolving agricultural landscape.
                </TranslatableText>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <TranslatableText>Our Values</TranslatableText>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <TranslatableText>
                The principles that guide everything we do at KrishiMitra
              </TranslatableText>
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  <TranslatableText>{value.title}</TranslatableText>
                </h3>
                <p className="text-gray-600">
                  <TranslatableText>{value.description}</TranslatableText>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <TranslatableText>Meet Our Team</TranslatableText>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <TranslatableText>
                The passionate individuals behind KrishiMitra
              </TranslatableText>
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <TranslatableText>Awards & Recognition</TranslatableText>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { year: '2025', award: 'Best AgriTech Startup', org: 'India AgriTech Summit' },
              { year: '2025', award: 'Innovation Excellence Award', org: 'Digital India Foundation' },
              { year: '2025', award: 'Rural Impact Award', org: 'Ministry of Agriculture' }
            ].map((award, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-start">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{award.year}</p>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    <TranslatableText>{award.award}</TranslatableText>
                  </h3>
                  <p className="text-gray-600 text-sm">
                    <TranslatableText>{award.org}</TranslatableText>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;