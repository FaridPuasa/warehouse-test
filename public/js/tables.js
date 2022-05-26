$(function() {
    $('#myTable').bootstrapTable()
  })

  var $table = $('#myTable')

  $(function() {
    $('#toolbar').find('select').change(function() {
      $table.bootstrapTable('destroy').bootstrapTable({
        exportDataType: $(this).val(),
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf'],
        columns: [{
            field: 'state',
            checkbox: true,
            visible: $(this).val() === 'selected'
          },
          {
            field: 'trackingNumber',
            title: 'Tracking Number'
          },
          {
            field: 'parcelNumber',
            title: 'P/N'
          },
          {
            field: 'area',
            title: 'Area'
          },
          {
            field: 'location',
            title: 'Location'
          },
          {
            field: 'name',
            title: 'Name'
          },
          {
            field: 'contact',
            title: 'Contact'
          },
          {
            field: 'address',
            title: 'Address'
          },
          {
            field: 'status',
            title: 'Status'
          },
          {
            field: 'warehouseRemark',
            title: 'Remark / GRP Charges'
          },
          {
            field: 'expiryDate',
            title: 'Expiry Date'
          },
          {
            field: 'age',
            title: 'Ageing'
          }
        ]
      })
    }).trigger('change')
  })