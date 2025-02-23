<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TeacherRegistration extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->view('media.teacher-registration')
            ->with([
                'name' => $this->data['name'],
                'email' => $this->data['email'],
                'password' => $this->data['password'],
                'cafedraName' => $this->data['cafedraName'],
                'position' => $this->data['position'],
                'degree' => $this->data['degree'],
                'loginUrl' => $this->data['loginUrl']
            ])
            ->subject('Регистрация преподавателя в системе');
    }
}
