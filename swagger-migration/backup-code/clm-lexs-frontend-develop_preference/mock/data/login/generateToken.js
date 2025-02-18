const body = {
    "accessToken": 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJLOVR3cWF4SnoyOHJqaFVRc1pweEoyUi13RVItSDVubXRPNjZ5dmF6WmVRIn0.eyJqdGkiOiI0NWE1NDhhYS0xYWEyLTQxOGQtOTBlMS1lZWFkYTM3MmYwMjEiLCJleHAiOjE1ODIxMTEyNDgsIm5iZiI6MCwiaWF0IjoxNTgyMTEwOTQ4LCJpc3MiOiJodHRwOi8va2V5Y2xvYWsuZGV2LWRldm9wcy5rdGI6ODA4MC9hdXRoL3JlYWxtcy9lc29sdXRpb24iLCJhdWQiOiJlc29sdXRpb24iLCJzdWIiOiJiODMxMmY3My1iZGNkLTRhNGQtODAxNC1mMWRlZDNmYmRkYTYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJlc29sdXRpb24iLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJjYjlkZjUxNC1jZjNmLTRlM2QtYTc2OS1iMjUxMjkzZjQ2ZjEiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm1ha2VyIl19LCJzY29wZSI6InByb2ZpbGUiLCJyb2xlcyI6WyJtYWtlciJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0OTA1OTAiLCJrY3NicmFuY2hjb2RlIjoiMTA4NDg1In0.ovF6C3ylgIHJgCcAqTEQ1nI-yGpUFyOo8wxyqURlOhdZPlmMFBBW9TybGrZ8A3XcuGRFXIu5k-eiQN3NOGyb7R6TAxAOxYIW9cBf_GIv2I_wy7ObrRaikpCNKWyqddQU_dhkO5NDqZd50lDOur2TqOt81BsvRD4W8LOq10Q34T9CYz2hCNYxT7BYuardtxRSIvlvYjcqDVVn2iHL9JEe7AgqNc9GKgrStqLXPjdhd9Hw_P-vAoD5u9Yute8qRbXLBkzIaCX8Wp3hUqAqu0KwwE0tDME7ZbPJ3-_NPPQh1HW1RWxRTHvO0bHt5nwJVKXvWP_ZrL8VF6eLvCk7Mp33-Q',
    "tokenType": "bearer",
    "expiresIn": 300,
    "sessionState": uuidv4()
  };

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


module.exports = body;
  
  
  
  
  
  