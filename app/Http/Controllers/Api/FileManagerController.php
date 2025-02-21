<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Illuminate\Support\Facades\Log;
use App\Models\Institute;
use App\Models\Cafedra;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Discipline;
use Illuminate\Support\Facades\Hash;

class FileManagerController extends Controller
{
    public function uploadData(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
            'type' => 'required|string|in:teachers,institutes,cafedras,disciplines,lessons'
        ]);

        try {
            $file = $request->file('file');
            $spreadsheet = IOFactory::load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();

            array_shift($rows);

            $stats = match ($request->type) {
                'teachers' => $this->importTeachers($rows),
                'institutes' => $this->importInstitutes($rows),
                'cafedras' => $this->importCafedras($rows),
                'disciplines' => $this->importDisciplines($rows),
                default => throw new \Exception('Неподдерживаемый тип данных')
            };

            return response()->json([
                'message' => 'Данные успешно загружены',
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error("Ошибка загрузки данных: " . $e->getMessage());
            return response()->json([
                'error' => 'Ошибка при загрузке данных: ' . $e->getMessage()
            ], 500);
        }
    }

    public function downloadData($type)
    {
        try {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            match ($type) {
                'teachers' => $this->exportTeachers($sheet),
                'institutes' => $this->exportInstitutes($sheet),
                'cafedras' => $this->exportCafedras($sheet),
                'disciplines' => $this->exportDisciplines($sheet),
                default => throw new \Exception('Неподдерживаемый тип данных')
            };

            $headerStyle = [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E9ECEF']
                ]
            ];
            $sheet->getStyle('A1:' . $sheet->getHighestColumn() . '1')->applyFromArray($headerStyle);

            foreach (range('A', $sheet->getHighestColumn()) as $col) {
                $sheet->getColumnDimension($col)->setAutoSize(true);
            }

            $directory = storage_path('app/public/exports');
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            $writer = new Xlsx($spreadsheet);
            $filename = $directory . '/' . $type . '_data.xlsx';
            $writer->save($filename);

            return response()->download($filename)->deleteFileAfterSend();
        } catch (\Exception $e) {
            Log::error("Ошибка выгрузки данных: " . $e->getMessage());
            return response()->json([
                'error' => 'Ошибка при выгрузке данных'
            ], 500);
        }
    }

    public function downloadTemplate($type)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        switch ($type) {
            case 'teachers':
                $sheet->fromArray([['ФИО', 'Пароль', 'Email', 'Название кафедры']], null, 'A1');
                break;
            case 'institutes':
                $sheet->fromArray([['Название']], null, 'A1');
                break;
            case 'cafedras':
                $sheet->fromArray([['Название кафедры', 'Название института']], null, 'A1');
                break;
            case 'disciplines':
                $sheet->fromArray([['Код', 'Название', 'Типы дисциплин (через запятую, например: lc - лекция, p - практика, lb - лабораторная, s - семинар)']], null, 'A1');
                break;
        }

        $headerStyle = [
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'E9ECEF']
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                'wrapText' => true
            ]
        ];

        $sheet->getStyle('A1:' . $sheet->getHighestColumn() . '1')->applyFromArray($headerStyle);

        foreach (range('A', $sheet->getHighestColumn()) as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $filename = storage_path('app/templates/excel/template_' . $type . '.xlsx');
        $writer->save($filename);

        return response()->download($filename)->deleteFileAfterSend();
    }

    private function importTeachers($rows)
    {
        $addedCount = 0;
        $duplicateCount = 0;
        $errors = [];

        foreach ($rows as $index => $row) {
            try {
                if (empty($row[0]) || empty($row[1]) || empty($row[2])) {
                    continue;
                }

                $existingUser = User::where('email', $row[2])->first();
                if ($existingUser) {
                    $errors[] = "Строка " . ($index + 2) . ": Пользователь с email '{$row[2]}' уже существует";
                    $duplicateCount++;
                    continue;
                }

                $user = User::create([
                    'name' => $row[0],
                    'email' => $row[2],
                    'role_id' => 2,
                    'password' => Hash::make($row[1]),
                ]);

                if (!empty($row[3])) {
                    $cafedra = Cafedra::whereRaw('LOWER(name) = ?', [strtolower($row[3])])->first();
                    if ($cafedra) {
                        Teacher::create([
                            'user_id' => $user->id,
                            'cafedra_id' => $cafedra->id,
                            'position' => 'Преподаватель',
                            'degree' => '-'
                        ]);
                    } else {
                        $errors[] = "Строка " . ($index + 2) . ": Кафедра '{$row[3]}' не найдена";
                    }
                }

                $addedCount++;

            } catch (\Exception $e) {
                $errors[] = "Строка " . ($index + 2) . ": " . $e->getMessage();
                Log::error("Ошибка импорта преподавателя: " . $e->getMessage());
            }
        }

        return [
            'added' => $addedCount,
            'duplicates' => $duplicateCount,
            'errors' => $errors
        ];
    }

    private function importInstitutes($rows)
    {
        $addedCount = 0;
        $duplicateCount = 0;
        $errors = [];

        foreach ($rows as $index => $row) {
            try {
                $name = trim($row[0]);

                if (empty($name)) {
                    continue;
                }

                $exists = Institute::where('name', $name)->exists();

                if (!$exists) {
                    Institute::create([
                        'name' => $name
                    ]);
                    $addedCount++;
                } else {
                    $duplicateCount++;
                }
            } catch (\Exception $e) {
                $errors[] = "Строка " . ($index + 2) . ": " . $e->getMessage();
                Log::error("Ошибка импорта института: " . $e->getMessage());
            }
        }

        return [
            'added' => $addedCount,
            'duplicates' => $duplicateCount,
            'errors' => $errors
        ];
    }

    private function importCafedras($rows)
    {
        $addedCount = 0;
        $duplicateCount = 0;
        $errors = [];

        foreach ($rows as $index => $row) {
            try {
                $cafedraName = trim($row[0]);
                $instituteName = trim($row[1]);

                if (empty($cafedraName) || empty($instituteName)) {
                    continue;
                }

                $institute = Institute::where('name', $instituteName)->first();

                if (!$institute) {
                    $errors[] = "Строка " . ($index + 2) . ": Институт '{$instituteName}' не найден";
                    continue;
                }

                $exists = Cafedra::where('name', $cafedraName)
                    ->where('institute_id', $institute->id)
                    ->exists();

                if (!$exists) {
                    Cafedra::create([
                        'name' => $cafedraName,
                        'institute_id' => $institute->id
                    ]);
                    $addedCount++;
                } else {
                    $duplicateCount++;
                }
            } catch (\Exception $e) {
                $errors[] = "Строка " . ($index + 2) . ": " . $e->getMessage();
                Log::error("Ошибка импорта кафедры: " . $e->getMessage());
            }
        }

        return [
            'added' => $addedCount,
            'duplicates' => $duplicateCount,
            'errors' => $errors
        ];
    }

    private function importDisciplines($rows)
    {
        $addedCount = 0;
        $duplicateCount = 0;
        $errors = [];

        $typeMapping = [
            'lc' => 'lecture',
            'p' => 'practice',
            'lb' => 'lab',
            's' => 'seminar'
        ];

        foreach ($rows as $index => $row) {
            try {
                $code = trim($row[0]);
                $name = trim($row[1]);
                $types = trim($row[2]);

                if (empty($code) || empty($name) || empty($types)) {
                    continue;
                }

                $exists = Discipline::where('code', $code)->exists();
                if ($exists) {
                    $errors[] = "Строка " . ($index + 2) . ": Дисциплина с кодом '{$code}' уже существует";
                    $duplicateCount++;
                    continue;
                }

                $typesList = array_map(function($type) {
                    return strtolower(trim($type));
                }, preg_split('/\s*,\s*/', $types));

                $validTypes = array_keys($typeMapping);
                $invalidTypes = array_diff($typesList, $validTypes);

                if (!empty($invalidTypes)) {
                    $errors[] = "Строка " . ($index + 2) . ": Неверные типы дисциплин: " . implode(', ', $invalidTypes);
                    continue;
                }

                $convertedTypes = array_map(function($type) use ($typeMapping) {
                    return $typeMapping[$type];
                }, $typesList);

                Discipline::create([
                    'code' => $code,
                    'name' => $name,
                    'types' => $convertedTypes
                ]);

                $addedCount++;

            } catch (\Exception $e) {
                $errors[] = "Строка " . ($index + 2) . ": " . $e->getMessage();
                Log::error("Ошибка импорта дисциплины: " . $e->getMessage());
            }
        }

        return [
            'added' => $addedCount,
            'duplicates' => $duplicateCount,
            'errors' => $errors
        ];
    }

    private function exportTeachers($sheet)
    {
        $sheet->fromArray([['ФИО', 'Email', 'Название кафедры']], null, 'A1');

        $teachers = Teacher::with(['user', 'cafedra'])->get();
        $row = 2;

        foreach ($teachers as $teacher) {
            $sheet->fromArray([[
                $teacher->user->name,
                $teacher->user->email,
                $teacher->cafedra ? $teacher->cafedra->name : ''
            ]], null, "A{$row}");
            $row++;
        }
    }

    private function exportInstitutes($sheet)
    {
        $sheet->fromArray([['Название']], null, 'A1');

        $institutes = Institute::all();
        $row = 2;

        foreach ($institutes as $institute) {
            $sheet->fromArray([[$institute->name]], null, "A{$row}");
            $row++;
        }
    }

    private function exportCafedras($sheet)
    {
        $sheet->fromArray([['Название кафедры', 'Название института']], null, 'A1');

        $cafedras = Cafedra::with('institute')->get();
        $row = 2;

        foreach ($cafedras as $cafedra) {
            $sheet->fromArray([[
                $cafedra->name,
                $cafedra->institute->name
            ]], null, "A{$row}");
            $row++;
        }
    }

    private function exportDisciplines($sheet)
    {
        $sheet->fromArray([['Код', 'Название', 'Типы дисциплин']], null, 'A1');

        $disciplines = Discipline::all();
        $row = 2;

        $typeMapping = [
            'lecture' => 'лекция',
            'practice' => 'практика',
            'lab' => 'лабораторная работа',
            'seminar' => 'семинар'
        ];

        foreach ($disciplines as $discipline) {
            $types = array_map(function($type) use ($typeMapping) {
                return $typeMapping[$type] ?? $type;
            }, $discipline->types);

            $sheet->fromArray([[
                $discipline->code,
                $discipline->name,
                implode(', ', $types)
            ]], null, "A{$row}");
            $row++;
        }
    }
}
