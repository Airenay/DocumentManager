import { Modal, Image } from 'react-bootstrap'

const About = props => (
  <Modal backdrop {...props} onClick={props.onHide} size='lg'>
    <Modal.Body>
      <h4>Система управления цифровыми дипломами на базе блокчейна</h4>

      <h6>Описание проблемы</h6>
      <p>
        Одной из ключевых проблем работы с документами является обеспечение их
        подлинности и отсутствия внесенных задним числом изменений. Традиционные базы
        данных не защищены от возможности административного вмешательства с целью
        несанкционированного изменения данных (в том числе, в рамках коррупционной
        составляющей). Система управления цифровыми дипломами на базе блокчейна решает
        эту проблему.
      </p>

      <h6>Принцип работы блокчейна</h6>
      <p>
        Блокчейн является глобальной распределенной системой хранения данных в связанных
        в цепочку блоках. Каждый блок криптографически связан с предыдущим таким образом,
        что любое изменение в промежуточном блоке неизбежно влечет за собой изменение всей
        последующей цепочки. Однако, пересчет уже созданных блоков требует огромных
        вычислительных ресурсов, превышающих ресурсы всей остальной мировой сети.
        Это делает модификацию сохраненных в блокчейне данных практически невозможным.
      </p>

      <h6>Принцип работы системы</h6>
      <p>
        Данная система хранит информацию о цифровых дипломах в блокчейне сети Ethereum.
        При вводе в систему данные документа переводятся в цифровой вид, подписываются
        цифровой подписью учебного заведения и в таком виде передаются смарт-контракту
        в сети Ethereum. Контракт сохраняет эти данные в хранилище блокчейна с фиксацией
        даты и времени. При просмотре этих данных можно видеть фактическую дату внесения
        документов в блокчейн, а сохраненная там же цифровая подпись удостоверит, что данные
        действительно были подписаны сертификатом выпустившего их учебного заведения.
        Смарт-контракт системы не предусматривает создания записей задним числом или внесения
        изменений без соответствующей регистрации: любое такое изменение будет зафиксировано,
        а дата исходной регистрации данных в блокчейне всегда известна. Код контракта
        является общедоступным, что позволяет провести его независимый аудит. Публичный
        ключ учебного заведения для проверки подписи также открыто публикуется на сайте
        заведения и/или на серверах публичных ключей в сети Internet.
      </p>

      <h6>Защита данных</h6>
      <p>
        Система защищена от несанкционированного вмешательства. Создатель-владелец
        смарт-контракта (администратор) может добавить произвольное количество уполномоченных
        аккаунтов Ethereum для работы с системой. Любое изменение базы требует, чтобы оно
        исходило от уполномоченного аккаунта, что проверяется на уровне смарт-контракта. Никто
        другой не сможет выполнить ни одну операцию с данными, за исключением просмотра. Если
        рассмотреть худший случай - теоретическую возможность перехвата аккаунта владельца
        смарт-контракта, - то даже при этом будет невозможно создать или изменить данные
        задним числом, поскольку каждое изменение фиксируется в момент создания очередного
        блока сети Ethereum, что происходит примерно каждые 15 секунд.
      </p>

      <h6>Возможность санкционированной модификации</h6>
      <p>
        На случай вынужденной необходимости аннулировать какой-либо из документов или внести
        в него изменения (если разрешено политикой системы) контракт предусматривает такие
        возможности. Вся история изменений необратимо остается в системе с целью аудита и
        будет показана при просмотре документа. Подлинность документа после любого изменения
        также гарантируется цифровой подписью учебного заведения, вносящего изменения.
      </p>

      <h6>Соответствие GDPR</h6>
      <p>
        Одна из целей создания системы - дать возможность потенциальным работодателям
        проверить факт получения соискателем документа в указанный период времени. Потому
        в ее основу положена полная прозрачность и независимость хранилища данных от
        конкретных лиц или организаций. Тем не менее, в исключительных случаях владелец
        документа может потребовать удаления его данных из публичного доступа (требование
        европейского закона GDPR и аналогичных). На этот случай предусмотрена соответствующая
        операция, выполняемая администратором системы. При ее выполнении данные в блокчейне
        будут помечены как недоступные для просмотра при обращении к контракту. Тем не менее,
        история изменений документа все равно будет сохранена в блокчейне с целью
        потенциального подтверждения того, что документ с конкретным номером ранее
        существовал, но позже был удален.
      </p>

      <h6>Требуемые ресурсы для работы системы</h6>
      <p>
        Использование современных технологий и отсутствие необходимости в собственной базе
        данных, роль которой выполняет блокчейн, позволило исключить потребность системы
        в выделенном сервере. Данные располагаются в распределенном блокчейне. Приложение
        загружается из бесплатного облачного сервиса. Дополнительная функция индексации
        данных реализуется также бесплатным публичным сервисом. В случае же необходимости
        все указанные сервисы, кроме блокчейна, могут быть в любой момент развернуты
        локально, после чего все данные будут доступны через собственный сайт системы
        (нет зависимости от сторонних сервисов).
      </p>

      <h6>Эксплуатационные затраты</h6>
      <p>
        Для модификации данных в блокчейне (внесение, изменение, удаление) используется
        вызов функции смарт-контракта. Эта операция стоит определенных средств в виде
        комиссии за транзакцию в сети Ethereum. Величина комиссии является переменной и
        зависит от загрузки сети. Для проверки работы системы последняя может быть
        развернута в тестовой сети Ethereum. В этом случае с учетом отсутствия затрат
        на хостинг и виртуально нулевую стоимость транзакций в тестовой сети можно
        использовать систему без каких-либо финансовых вложений.
      </p>

      <h6>Управление доступом</h6>
      <p>
        Для просмотра данных достаточно обычного браузера. Для модификации данных используется
        браузер с поддержкой криптовалютного кошелька Ethereum. Это может быть как один из
        популярных браузеров (Chrome, FireFox и другие) с установленным расширением Mist
        или MetaMask, так и браузеры со встроенной поддержкой криптовалют (Brave, Opera).
        Адрес кошелька браузера вносится в список разрешенных администратором системы, после
        чего с этого адреса возможно инициировать выполнение операций по изменению данных.
        В случае компрометации адрес может быть удален из списка разрешенных.
      </p>

      <h6>Преимущества системы</h6>
      <p>
        При сравнительно небольших затратах использование системы хранения данных на базе
        блокчейна гарантирует как подлинность документов, так и отсутствие несанкционированных
        изменений в них. Это является основным преимуществом системы в сравнении с
        традиционными базами данных, управляемыми централизованно. Кроме того, данные в
        блокчейне невозможно утратить, так как копия блокчейна хранится на каждом из тысяч
        компьютеров, выполняющих генерацию новых блоков в процессе майнинга.
      </p>

      <style jsx>{`
        p {
          text-align: justify;
          word-wrap: break-word;
        }
      `}</style>

    </Modal.Body>
  </Modal>
)

export default About