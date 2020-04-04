$(document).ready(function () {

    var source = $('#calendario-template').html();
    var template = Handlebars.compile(source);




    var dataSelezionata = moment("2018-01-01");
    var meseSelezionato = dataSelezionata.format("MM");
    console.log(meseSelezionato);


    creaLista(dataSelezionata);
    richiamaFeste(meseSelezionato);


    $('.btn-succ').click(function() {
        if (meseSelezionato == 12) {
            dataSelezionata = moment("2018-01-01");
            nomeMese = dataSelezionata.format("MMMM");
            meseSelezionato = dataSelezionata.format("MM");
        } else {
            dataSelezionata.add(1, "month");
            nomeMese = dataSelezionata.format("MMMM");
            meseSelezionato = dataSelezionata.format("MM");
        }

        $('.mese').text(nomeMese);
        creaLista(dataSelezionata, nomeMese);
        richiamaFeste(meseSelezionato);
    });

    $('.btn-prev').click(function() {
        if (meseSelezionato == 01) {
            dataSelezionata = moment("2018-12-01");
            nomeMese = dataSelezionata.format("MMMM");
            meseSelezionato = dataSelezionata.format("MM");
        } else {
            dataSelezionata.subtract(1, "month");
            nomeMese = dataSelezionata.format("MMMM");
            meseSelezionato = dataSelezionata.format("MM");
        }

        $('.mese').text(nomeMese);
        creaLista(dataSelezionata, nomeMese);
        richiamaFeste(meseSelezionato);
    });


    function creaLista(data) {
        $('.ul-giorni').empty();
        var nomeMese = data.format("MMMM");
        var dataDaGestire = data.clone();
        var giorniTotaliMese = data.daysInMonth();
        $('.mese').text(nomeMese);


        for (var i = 1; i <= giorniTotaliMese; i++) {
            var questoGiorno = {
                giorno: i + " " + nomeMese,
                dataGiorno: dataDaGestire.format("YYYY-MM-DD")
            }

            var giornoCompilato = template(questoGiorno);
            $('.ul-giorni').append(giornoCompilato);
            dataDaGestire.add(1 , "day");
        }
    }

    function richiamaFeste(mese) {
        $.ajax ({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: 2018,
                month: (mese-1)
            },
            success: function(data) {
                var listaFestivi = data.response;
                for (var i = 0; i < listaFestivi.length; i++) {
                    var questoFestivo = listaFestivi[i];
                    var nomeFestivo = questoFestivo.name;
                    var dataFestivo = questoFestivo.date;
                    $('.ul-giorni li[data-giorno="'+ dataFestivo + '"]').addClass('rosso').append(" "+ nomeFestivo);
                }
            }
        })
    }
});
