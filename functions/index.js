/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmailAfterReview = functions.database.ref('/FeedbackStars/{uid}').onWrite(async (change) => {
  const snapshot = change.after;
  const val = snapshot.val();

  //if (!snapshot.changed('subscribedToMailingList')) {
    //return null;
  //}

  const mailOptions = {
    from: '"Snippets, Inc." <alek@snippetsla.com>',
    to: '"Snippets, Inc." <alek@snippetsla.com>',
  };

  //const subscribed = val.subscribedToMailingList;

  // Building Email message.
  mailOptions.subject = 'New Review Received';  //for example
  mailOptions.text = "Book ID:" + val.bookID + "\n" + "Review:" + val.comments + "\n" + "Rating:" + val.stars;


  try {
    await mailTransport.sendMail(mailOptions);
    console.log('email sent to:', val.email);
  } catch(error) {
    console.error('There was an error while sending the email:', error);
  }
  return null;
});
