import urllib.request, json
try:
    req = urllib.request.Request(
        "https://api.github.com/repos/Debanshu17/Ai-resume-analyser/events",
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    with urllib.request.urlopen(req) as response:
        events = json.loads(response.read().decode())
        
    for event in events:
        if event['type'] == 'PushEvent':
            print('PushEvent at', event['created_at'])
            print('Before:', event['payload'].get('before'))
            print('Head:', event['payload'].get('head'))
            print('Ref:', event['payload'].get('ref'))
            print('---')
except Exception as e:
    print('Error:', e)
