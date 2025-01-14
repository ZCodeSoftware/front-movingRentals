import PaymentCard from '../assets/SVG/Payment-Card.svg'
import Refund from '../assets/SVG/Refund.svg'
import Car from '../assets/SVG/Car.svg'
import CautionSign from '../assets/SVG/Caution-Sign.svg'
import Repair from '../assets/SVG/Repair.svg'
import Chat from '../assets/SVG/Chat.svg'


export const faqsEnContent = [
    {
      category: {title:"Reservations and Payments", logo:`${PaymentCard}`},
      questions: [
        {
          question: "How can I book a vehicle?",
          answer: "You can book a vehicle with a 20% deposit of the total rental cost.",
        },
        {
          question: "What are the payment options?",
          answer: "Payment is made exclusively by credit or debit card. The security deposit can be paid in cash or by card (+5% bank fee).",
        },
        {
          question: "Can I modify or cancel my reservation?",
          answer: "Modifications are subject to availability. For cancellations, please contact us at least 48 hours in advance.",
        },
      ],
    },
    {
      category: {title:"Security Deposit and Refunds", logo:`${Refund}`},
      questions: [
          {
            question: "How much is the security deposit?",
            answer: "- Bicycles: Passport or ID + $1,000 MXN or $3,000 MXN.\n - Scooters: Passport + $2,000 MXN, ID + $3,000 MXN, or up to $25,000 MXN depending on the model.\n - ATVs: Passport + $3,000 MXN, ID + $4,000 MXN, or $30,000 MXN.\n - Cars: Passport + $4,000 MXN or ID + $8,000 MXN."
          },      
          {
            question: "How long does it take to get my security deposit refunded?",
            answer: "The refund processing time is 1 to 5 business days by Moving Rentals. After that, it depends on the bank for the funds to reflect in your account.",
          },
          {
            question: "Can I get cash back if I paid my deposit by card?",
            answer: "No, the refund will be processed in the same way the payment was made.",
          },
          {
            question: "What happens if my debit or credit card is lost or stolen?",
            answer: "If your card is lost or stolen, our bank will issue the refund to your bank account. The money will be available on your new debit or credit card as applicable.",
          },
      ],
    },
    {
        category: {title:"Vehicle Pickup and Return", logo:`${Car}`},
        questions: [
          {
            question:"What does the vehicle rental include?",
            answer: "- Safety helmet.\n- Phone holder or GPS.\n- Full tank of gas.\n- Chain or alarmed lock.\n- Assistance during the rental period."
          },  
          {
            question:"What if I arrive at the store and it’s closed?",
            answer:"You can leave the vehicle parked outside the store, secured with its lock or chain, and return later to collect your security deposit or arrange for the vehicle to be picked up at your hotel and the key recovered.",
          },
          {
            question:"Can I exchange my rented vehicle for another?", 
            answer:"Yes, you can exchange your rented vehicle for another, subject to availability. Any cost difference must be settled with the administration.",
          },
        ],
      },
      {
        category: {title:"Safety and Driving Rules", logo:`${CautionSign}`},
        questions: [
          {
            question: "What safety measures should I follow while driving?",
            answer: "- Do not exceed the speed limit of 60 km/h.\n - Wear a helmet at all times.\n - Do not park in areas with yellow or blue curbs.\n - If you see the 🚫 symbol next to an 'E,' it means No Parking.\n - Do not drive under the influence of alcohol or drugs.\n - Always yield to pedestrians.\n - Keep your lights on at all times.\n - Maintain a safe distance from other vehicles.\n - Use turn signals and hand signals before turning.\n - Avoid using your phone while driving.\n - Do not block pedestrian crossings."
          },      
          {
            question: "Is it legal to drive ATVs on all streets in Tulum?",
            answer: "Yes, it is fully legal to drive ATVs on all streets in Tulum as long as traffic regulations are respected.",
          },
        ],
      },
      {
        category: {title:"Incidents and Repairs", logo:`${Repair}`},
        questions: [
          {
            question: "What happens if the vehicle gets damaged during the rental?",
            answer: "The customer is responsible for damages, which will be assessed based on photos taken before the rental."
          },      
          {
            question: "What to do in case of a flat tire?",
            answer: "Try to resolve the issue with a nearby shop at your own cost. If unresolved, contact us, and we will assist with the repair.",
          },
          {
            question: "What if I lose the vehicle key?",
            answer: "If the key is lost, a switch change will be necessary, incurring additional costs.",
          },
          {
             question: "What if the key gets locked inside the trunk?",
             answer: "If the key is locked inside the trunk, a locksmith will need to be hired to open it, which will generate additional costs.",
          },
          {
            question: "What if the vehicle is taken by the police?",
            answer: "If the vehicle is towed by the police due to improper parking, you will need to pay the traffic fine, towing fees, and storage costs.",
          },
        ],
      },
      {
        category: {title:"Service and Contact", logo:`${Chat}`},
        questions: [
          {
            question: "What are the store hours?",
            answer: "Our store is open from 9 a.m. to 7 p.m., seven days a week, including holidays. However, we offer 24-hour emergency assistance."
          },      
          {
            question: "How can I submit complaints, refunds, or deposit returns?",
            answer: "For complaints, refunds, or deposit returns, please contact admin@movingtulum@gmail.com or call +52 984-141-4169.",
          },
        ],
      },
  ];