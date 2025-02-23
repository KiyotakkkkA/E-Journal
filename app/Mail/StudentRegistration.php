<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StudentRegistration extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->view('media.student-registration')
            ->with([
                'email' => $this->data['email'],
                'password' => $this->data['password'],
                'groupName' => $this->data['groupName'],
                'loginUrl' => $this->data['loginUrl']
            ])
            ->subject('Регистрация в системе');
    }
}
