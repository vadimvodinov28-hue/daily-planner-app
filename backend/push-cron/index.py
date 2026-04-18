import json
import os
import urllib.request
import urllib.error

SCHEDULER_URL = "https://functions.poehali.dev/f10f6f28-103a-4d40-971a-14fa18ae6672"

def handler(event: dict, context) -> dict:
    """Cron-триггер: вызывает push-scheduler каждую минуту чтобы слать уведомления при закрытом браузере."""
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    try:
        req = urllib.request.Request(SCHEDULER_URL, method="GET")
        with urllib.request.urlopen(req, timeout=25) as resp:
            result = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"cron": "ok", "scheduler_error": body})}
    except Exception as ex:
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"cron": "ok", "error": str(ex)})}

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"cron": "ok", "scheduler": result})
    }
