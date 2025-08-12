import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import io from 'socket.io-client';

const VideoCallPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isExpert = searchParams.get('expert') === 'true' || localStorage.getItem('expert');
  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteVideoOff, setRemoteVideoOff] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, waiting, active, ended
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    let mounted = true;
    let pc = null;
    let newSocket = null;
    
    const initializeCall = async () => {
      try {
        // Initialize socket
        newSocket = io('http://localhost:5008');
        setSocket(newSocket);

        // Initialize peer connection
        pc = new RTCPeerConnection(iceServers);
        setPeerConnection(pc);

        // Get user media first
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (!mounted) return;
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          // Ensure local video plays
          localVideoRef.current.play().catch(e => console.log('Local video play failed:', e));
        }

        // Add tracks to peer connection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // Handle remote stream
        pc.ontrack = (event) => {
          console.log('Remote stream received:', event.streams[0]);
          const [remoteStream] = event.streams;
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            // Ensure video plays
            remoteVideoRef.current.play().catch(e => console.log('Remote video play failed:', e));
          }
          setIsConnected(true);
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate && newSocket) {
            console.log('Sending ICE candidate');
            newSocket.emit('ice-candidate', { roomId, candidate: event.candidate });
          }
        };

        // Monitor connection state
        pc.oniceconnectionstatechange = () => {
          console.log('ICE connection state:', pc.iceConnectionState);
          const connected = pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed';
          setIsConnected(connected);
          
          if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
            console.log('Connection failed or disconnected');
            setIsConnected(false);
          }
        };
        
        // Monitor signaling state
        pc.onsignalingstatechange = () => {
          console.log('Signaling state:', pc.signalingState);
        };
        
        // Monitor connection state
        pc.onconnectionstatechange = () => {
          console.log('Connection state:', pc.connectionState);
        };

        // Socket event handlers
        newSocket.on('user-connected', async (data) => {
          console.log('Another user connected:', data);
        });
        
        newSocket.on('call-ready', async () => {
          console.log('Call ready - both users present');
          setCallStatus('active');
          // Don't automatically create offer here - let the first user (farmer) create it
        });
        
        newSocket.on('start-call', async () => {
          console.log('Starting call - creating offer');
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            newSocket.emit('offer', { roomId, offer });
          } catch (error) {
            console.error('Error creating offer:', error);
          }
        });
        
        newSocket.on('expert-joined', () => {
          console.log('Expert joined the call');
          setCallStatus('active');
        });
        
        newSocket.on('waiting-for-expert', () => {
          console.log('Waiting for expert to join');
          setCallStatus('waiting');
        });
        
        newSocket.on('user-disconnected', () => {
          console.log('User disconnected');
          setRemoteStream(null);
          setIsConnected(false);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
        });

        newSocket.on('offer', async (data) => {
          console.log('Received offer, signaling state:', pc.signalingState);
          try {
            if (pc.signalingState === 'stable' || pc.signalingState === 'have-remote-offer') {
              await pc.setRemoteDescription(data.offer);
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              newSocket.emit('answer', { roomId, answer });
            }
          } catch (error) {
            console.error('Error handling offer:', error);
          }
        });

        newSocket.on('answer', async (data) => {
          console.log('Received answer, signaling state:', pc.signalingState);
          try {
            if (pc.signalingState === 'have-local-offer') {
              await pc.setRemoteDescription(data.answer);
            }
          } catch (error) {
            console.error('Error handling answer:', error);
          }
        });

        newSocket.on('ice-candidate', async (data) => {
          console.log('Received ICE candidate');
          try {
            if (pc.remoteDescription) {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            } else {
              console.log('Queuing ICE candidate - no remote description yet');
              // Queue the candidate for later
              setTimeout(() => {
                if (pc.remoteDescription) {
                  pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                }
              }, 1000);
            }
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        });

        newSocket.on('call-ended', (data) => {
          console.log('Call ended by remote user:', data);
          if (data.endedBy !== newSocket.id) {
            // Only cleanup if call was ended by someone else
            cleanup();
            // Navigate to appropriate page based on user type
            if (isExpert) {
              navigate('/expert-dashboard');
            } else {
              navigate('/expert');
            }
          }
        });
        
        // Handle remote user video/audio toggles
        newSocket.on('remote-video-toggle', (data) => {
          console.log('Remote user toggled video:', data.videoOff);
          setRemoteVideoOff(data.videoOff);
        });
        
        newSocket.on('remote-audio-toggle', (data) => {
          console.log('Remote user toggled audio:', data.muted);
          // You can add visual indicator for remote mute if needed
        });

        // Determine user type
        const userType = isExpert ? 'expert' : 'farmer';
        
        // Join the room with user type
        newSocket.emit('join-room', { roomId, userType });
        console.log('Joined room:', roomId, 'as', userType);
        
        // Set initial status
        if (userType === 'farmer') {
          setCallStatus('waiting');
        } else {
          setCallStatus('connecting');
        }

      } catch (error) {
        console.error('Error initializing call:', error);
        alert('Failed to access camera/microphone');
      }
    };

    initializeCall();

    return () => {
      mounted = false;
      console.log('Component unmounting - cleaning up video call');
      
      // Cleanup all resources
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped track on unmount:', track.kind);
        });
      }
      if (pc) {
        pc.close();
      }
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [roomId]);

  const cleanup = () => {
    console.log('Cleaning up call resources');
    
    // Stop local stream and turn off video
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      setLocalStream(null);
    }
    
    // Stop remote stream
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped remote track:', track.kind);
      });
      setRemoteStream(null);
    }
    
    // Close peer connection
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    
    // Clear video refs and ensure video elements are cleared
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
      localVideoRef.current.load();
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
      remoteVideoRef.current.load();
    }
    
    setIsConnected(false);
    setIsVideoOff(false);
    setIsMuted(false);
  };

  const endCall = () => {
    console.log('End call clicked');
    
    // Cleanup resources first to stop video
    cleanup();
    
    // Notify other user about call end
    if (socket) {
      socket.emit('end-call', roomId);
      socket.disconnect();
      setSocket(null);
    }
    
    // Navigate back to appropriate page
    if (isExpert) {
      navigate('/expert-dashboard');
    } else {
      navigate('/expert');
    }
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const newMutedState = !audioTrack.enabled;
        setIsMuted(newMutedState);
        
        // Notify remote user
        if (socket) {
          socket.emit('audio-toggle', { roomId, muted: newMutedState });
        }
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        const newVideoOffState = !videoTrack.enabled;
        setIsVideoOff(newVideoOffState);
        
        // Notify remote user
        if (socket) {
          socket.emit('video-toggle', { roomId, videoOff: newVideoOffState });
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white text-2xl">Video Call - Room: {roomId}</h1>
          <div className={`px-3 py-1 rounded-full text-sm ${
            callStatus === 'active' && isConnected ? 'bg-green-600 text-white' : 
            callStatus === 'waiting' ? 'bg-yellow-600 text-white' :
            callStatus === 'connecting' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}>
            {callStatus === 'active' && isConnected ? 'Connected' :
             callStatus === 'waiting' ? 'Waiting for Expert' :
             callStatus === 'connecting' ? 'Connecting...' : 'Call Ended'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 relative">
            <h3 className="text-white mb-2">
              {isExpert ? 'You (Expert)' : 'You (Farmer)'}
              {isMuted && <span className="ml-2 text-red-400">(Muted)</span>}
            </h3>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className={`w-full h-64 bg-black rounded ${isVideoOff ? 'hidden' : ''}`}
            />
            {isVideoOff && (
              <div className="w-full h-64 bg-gray-700 rounded flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">📹</div>
                  <div>Video Off</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 relative">
            <h3 className="text-white mb-2">
              {isExpert ? 'Farmer' : 'Expert'}
              {remoteVideoOff && <span className="ml-2 text-red-400">(Video Off)</span>}
            </h3>
            <video
              ref={remoteVideoRef}
              autoPlay
              className={`w-full h-64 bg-black rounded ${remoteVideoOff ? 'hidden' : ''}`}
            />
            {(!remoteStream || remoteVideoOff) && (
              <div className="w-full h-64 bg-gray-700 rounded flex items-center justify-center">
                {!remoteStream ? (
                  <div className="text-center text-white">
                    {callStatus === 'waiting' ? (
                      <>
                        <div className="animate-pulse mb-2 text-4xl">⏳</div>
                        <div>Waiting for expert to accept...</div>
                      </>
                    ) : callStatus === 'connecting' ? (
                      <>
                        <div className="animate-spin mb-2 text-4xl">🔄</div>
                        <div>Connecting...</div>
                      </>
                    ) : (
                      <>
                        <div className="text-4xl mb-2">👤</div>
                        <div>{isExpert ? 'Farmer' : 'Expert'} will appear here</div>
                      </>
                    )}
                  </div>
                ) : remoteVideoOff ? (
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">📹</div>
                    <div>{isExpert ? 'Farmer' : 'Expert'} turned off video</div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center mt-6 space-x-4">
          {callStatus === 'active' && (
            <>
              <button 
                onClick={toggleMute}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              
              <button 
                onClick={toggleVideo}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                {isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
              </button>
            </>
          )}
          
          <button 
            onClick={endCall}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            {callStatus === 'waiting' ? 'Cancel Call' : 'End Call'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;