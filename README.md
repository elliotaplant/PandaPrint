# Panda Print
Print photos with a text message

## Pipelines

### SMS
- Recieve SMS
  - Known account
    - Has text
      - Is "Send it" message
        - Current order has no pictures
          - Reply with "no pictures in order" message
        - Current order is large enough
          - Send Order
          - Reply with "confirmation" message
        - Current order is not large enough
          - Reply with "send it anyways?" message
      - Is "Send it anyways" message
        - Current order has any pictures
          - Send order
          - Reply with "confirmation" message
        - Current order has no pictures
          - Reply with "no pictures in order" message
      - Else
        - Fetch human
        - Reply with "Fetching human" message
    - Has picture(s)
        - Save pictures to order
        - Order big enough to send
          - Reply with "received and ready to send" message
        - Order not big enough to send
          - Reply with "received" message
  - Unknown account
    - Create row in DB with number
    - Has text
      - Fetch human
      - Reply with "Fetching human" message
    - Has pics
      - Save pics to order
      - Order big enough send
        - Reply with "received and link to signup page" message
      - Order not big enough to send
        - Reply with "received" message
