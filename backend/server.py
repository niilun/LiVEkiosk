from flask import Flask, jsonify, request
import subprocess, json, time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/youtube_info')
def is_live():
    video_id = request.args.get('id', None)
    if not video_id:
        return jsonify({
            'error': 'no id provided'
        })
    
    url = f"https://www.youtube.com/watch?v={video_id}"

    try:
        # get video info json
        result = subprocess.run(['yt-dlp', '--skip-download', '--print-json', url], capture_output=True, text=True, check=True)
        data = json.loads(result.stdout)

        # if it's live, send it back
        is_live = data.get('is_live', False)
        if is_live:
            return jsonify({
                'is_live': True,
                'is_video': False,
                'is_scheduled': False,
                'scheduled_start_time': None
                })

        # if scheduled, send the start time along with the is_scheduled bool
        live_details = data.get('liveStreamingDetails', {})
        scheduled_start_time = live_details.get('scheduled_start_time', None)

        if scheduled_start_time:
            return jsonify({
                'is_live': False,
                'is_video': False,
                'is_scheduled': True,
                'scheduled_start_time': scheduled_start_time
            })
        
        # if neither live nor scheduled, communicate that it's a video
        return jsonify({
            'is_live': False,
            'is_video': True,
            'is_scheduled': False,
            'scheduled_start_time': None
        })
    # handle errors
    except subprocess.SubprocessError as error:
        # if yt-dlp can't get the start time, report it as is
        error_output = error.stderr
        if 'This live event will begin in' in error_output:
            approx_time = error_output.split('This live event will begin in')[1].strip().split('.')[0]
            current_unix_time = int(time.time())
            approx_time_seconds = int(approx_time[0]) * 86400
            approx_time = str(current_unix_time + approx_time_seconds)

            return jsonify({
                'is_live': False,
                'is_video': False,
                'is_scheduled': True,
                'scheduled_start_time': approx_time
            })
        return jsonify({'error': 'subprocess error occurred', 'details': error_output}), 500
        
    except Exception as error:
        return jsonify({'error': str(error)}), 500

if __name__ == '__main__':
    app.run(debug=True)
