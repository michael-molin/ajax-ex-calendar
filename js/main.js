$(document).ready(function () {
    var source = $('#calendario-template').html();
    var template = Handlebars.compile(source);

    var dataSelezionata = moment("2018-01-01");
    var dataLimiteIniziale = moment('2018-01-01');
    var dataLimiteFinale = moment('2018-12');

    creaGiorniSettimana(dataSelezionata);
    creaLista(dataSelezionata);
    richiamaFeste(dataSelezionata);

    $('.btn-succ').click(function() {
        $('.btn-prev').prop('disabled', false);
        dataSelezionata.add(1, "month");
        creaLista(dataSelezionata);
        richiamaFeste(dataSelezionata);

        if (dataSelezionata.isSameOrAfter(dataLimiteFinale)) {
            $('.btn-succ').prop('disabled', true);
        }
    });

    $('.btn-prev').click(function() {
        $('.btn-succ').prop('disabled', false);
        dataSelezionata.subtract(1, "month");
        creaLista(dataSelezionata);
        richiamaFeste(dataSelezionata);

        if (dataSelezionata.isSameOrBefore(dataLimiteIniziale)) {
            $('.btn-prev').prop('disabled', true);
        }
    });

    function creaLista(data) {
        $('.ul-giorni').empty();
        var nomeMese = data.format("MMMM");
        var dataDaGestire = data.clone();
        var giorniTotaliMese = data.daysInMonth();
        $('.mese').text(nomeMese);

        for (var giorniMesePrecedente = 1; giorniMesePrecedente  < data.isoWeekday(); giorniMesePrecedente++) {
            $('.ul-giorni').append("<li class='giorno-vuoto'> </li>");
        }

        for (var i = 1; i <= giorniTotaliMese; i++) {
            var questoGiorno = {
                giorno: i + " " + nomeMese,
                dataGiorno: dataDaGestire.format("YYYY-MM-DD"),
                giornoSettimana: dataDaGestire.isoWeekday()
            }

            var giornoCompilato = template(questoGiorno);
            $('.ul-giorni').append(giornoCompilato);
            dataDaGestire.add(1 , "day");
        }
        $('.ul-giorni li[giorno-settimana="7"]').addClass('rosso');
    }

    function richiamaFeste(data) {
        $.ajax ({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: 2018,
                month: data.month()
            },
            success: function(data) {
                var listaFestivi = data.response;
                for (var i = 0; i < listaFestivi.length; i++) {
                    var questoFestivo = listaFestivi[i];
                    var nomeFestivo = questoFestivo.name;
                    var dataFestivo = questoFestivo.date;
                    $('.ul-giorni li[data-giorno="'+ dataFestivo + '"]').addClass('rosso').append(nomeFestivo);
                }
            }
        })
    }

    function creaGiorniSettimana(data) {
        var dataTemp = data.clone();
        for (var i = 1; i <= 7; i++) {
            $('.nome-giorni').append("<li>"+ dataTemp.format('dddd')+"</li>");
            dataTemp.add(1,'days');
        }
    }
});
