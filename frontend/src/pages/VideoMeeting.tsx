import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ArrowLeft, Video } from 'lucide-react';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export const VideoMeeting: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const domain = 'meet.jit.si';
    const roomName = `NutriMindConsultation_${appointmentId}`;

    const loadJitsiScript = () => {
      return new Promise((resolve) => {
        if (window.JitsiMeetExternalAPI) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = `https://${domain}/external_api.js`;
        script.async = true;
        script.onload = () => resolve(true);
        document.head.appendChild(script);
      });
    };

    loadJitsiScript().then(() => {
      setLoading(false);
      if (jitsiContainerRef.current && !apiRef.current) {
        const options = {
          roomName: roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: user?.name || 'Participant'
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
              'security'
            ]
          }
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        apiRef.current = api;

        api.addEventListener('videoConferenceLeft', () => {
          navigate(-1);
        });
      }
    });

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [appointmentId, user, navigate]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 pb-10">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-extrabold text-xl tracking-tight flex items-center gap-2">
              <Video className="text-emerald-500" size={20} /> Video Consultation Room
            </h2>
            <p className="text-[10px] text-slate-400">Secure end-to-end encrypted clinical review call</p>
          </div>
        </div>
      </div>

      {/* Embedded IFrame container */}
      <div className="flex-1 glass-card overflow-hidden border-slate-200/50 dark:border-slate-800/40 relative min-h-[450px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-950 z-10">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="text-xs text-slate-400">Initializing secure video conference stream...</p>
            </div>
          </div>
        )}
        <div ref={jitsiContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};
